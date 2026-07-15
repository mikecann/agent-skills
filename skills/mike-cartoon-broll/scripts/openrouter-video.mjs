#!/usr/bin/env node

import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const VIDEO_URL = "https://openrouter.ai/api/v1/videos";
const MODELS_URL = `${VIDEO_URL}/models`;

const loadOpenRouterKey = () => {
  if (process.env.OPENROUTER_API_KEY) return;

  const scriptDirectory = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    process.env.MIKE_AGENT_SKILLS_ENV,
    resolve(scriptDirectory, "../../..", ".env"),
    resolve(homedir(), "dev/me/agent-skills/.env"),
  ].filter(Boolean);

  for (const envPath of new Set(candidates)) {
    if (!existsSync(envPath)) continue;
    for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const match = line.match(
        /^\s*(?:export\s+)?OPENROUTER_API_KEY\s*=\s*(.*?)\s*$/,
      );
      if (!match) continue;
      let value = match[1];
      if (
        value.length >= 2 &&
        ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'")))
      ) {
        value = value.slice(1, -1);
      }
      if (value) {
        process.env.OPENROUTER_API_KEY = value;
        return;
      }
    }
  }
};

const parseArgs = (values) => {
  const args = { audio: false };
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === "--audio") {
      args.audio = true;
      continue;
    }
    if (value === "--no-audio") {
      args.audio = false;
      continue;
    }
    if (!value.startsWith("--"))
      throw new Error(`Unexpected argument: ${value}`);
    const key = value.slice(2).replaceAll("-", "_");
    const next = values[index + 1];
    if (!next || next.startsWith("--"))
      throw new Error(`Missing value for ${value}`);
    args[key] = next;
    index += 1;
  }
  return args;
};

const requireArg = (args, name) => {
  const value = args[name];
  if (value === undefined)
    throw new Error(`Missing --${name.replaceAll("_", "-")}`);
  return value;
};

const resolutionDimensions = (resolution, aspectRatio) => {
  if (aspectRatio !== "16:9") return null;
  return (
    {
      "480p": [854, 480],
      "720p": [1280, 720],
      "1080p": [1920, 1080],
      "4K": [3840, 2160],
    }[resolution] ?? null
  );
};

const priceQuote = ({
  model,
  resolution,
  duration,
  aspectRatio,
  audio,
  inputCount,
}) => {
  const skus = model.pricing_skus ?? {};
  const suffix = resolution.toLowerCase();
  const mode = audio ? "with_audio" : "without_audio";
  const candidates = [
    `duration_seconds_${mode}_${suffix}`,
    `duration_seconds_${mode}`,
    `image_to_video_duration_seconds_${suffix}`,
    `duration_seconds_${suffix}`,
    "duration_seconds",
  ];

  let quoted = null;
  for (const key of candidates) {
    const raw = skus[key];
    if (raw !== undefined) {
      const perSecondUsd = Number(raw);
      quoted = { pricingKey: key, perSecondUsd };
      break;
    }
  }

  const centsKey = `cents_per_video_output_second_${suffix}`;
  if (!quoted && skus[centsKey] !== undefined) {
    const perSecondUsd = Number(skus[centsKey]) / 100;
    quoted = { pricingKey: centsKey, perSecondUsd };
  }

  const tokenKey = audio ? "video_tokens" : "video_tokens_without_audio";
  const tokenPrice = skus[tokenKey] ?? skus.video_tokens;
  const dimensions = resolutionDimensions(resolution, aspectRatio);
  if (!quoted && tokenPrice !== undefined && dimensions) {
    const [width, height] = dimensions;
    const tokensPerSecond = (width * height * 24) / 1024;
    const perSecondUsd = tokensPerSecond * Number(tokenPrice);
    quoted = { pricingKey: tokenKey, perSecondUsd };
  }

  if (!quoted) return null;
  const inputCostUsd = skus.cents_per_image_input
    ? (Number(skus.cents_per_image_input) * inputCount) / 100
    : 0;
  return {
    ...quoted,
    inputCostUsd,
    estimatedCostUsd: quoted.perSecondUsd * duration + inputCostUsd,
  };
};

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok)
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  return response.json();
};

const loadModelAndQuote = async (args) => {
  const modelId = requireArg(args, "model");
  const resolution = requireArg(args, "resolution");
  const duration = Number(requireArg(args, "duration"));
  const aspectRatio = args.aspect_ratio ?? "16:9";
  if (!Number.isFinite(duration) || duration <= 0)
    throw new Error("Duration must be positive");

  const { data: models } = await fetchJson(MODELS_URL);
  const model = models.find((candidate) => candidate.id === modelId);
  if (!model) throw new Error(`Unknown video model: ${modelId}`);
  if (!model.supported_resolutions?.includes(resolution)) {
    throw new Error(`${modelId} does not support ${resolution}`);
  }
  if (!model.supported_durations?.includes(duration)) {
    throw new Error(`${modelId} does not support ${duration}s`);
  }
  if (!model.supported_aspect_ratios?.includes(aspectRatio)) {
    throw new Error(`${modelId} does not support ${aspectRatio}`);
  }

  const inputCount =
    Number(Boolean(args.first_frame)) + Number(Boolean(args.last_frame));
  const quote = priceQuote({
    model,
    resolution,
    duration,
    aspectRatio,
    audio: args.audio,
    inputCount,
  });
  return { model, resolution, duration, aspectRatio, quote };
};

const mimeType = (path) => {
  const extension = extname(path).toLowerCase();
  if (extension === ".png") return "image/png";
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".webp") return "image/webp";
  throw new Error(`Unsupported frame image: ${path}`);
};

const imageDataUrl = (path) => {
  const absolutePath = resolve(path);
  if (!existsSync(absolutePath))
    throw new Error(`Missing frame image: ${absolutePath}`);
  return `data:${mimeType(absolutePath)};base64,${readFileSync(absolutePath).toString("base64")}`;
};

const requestSummary = (args, loaded) => ({
  model: loaded.model.id,
  resolution: loaded.resolution,
  durationSeconds: loaded.duration,
  aspectRatio: loaded.aspectRatio,
  generateAudio: args.audio,
  firstFrame: args.first_frame ? resolve(args.first_frame) : null,
  lastFrame: args.last_frame ? resolve(args.last_frame) : null,
  promptFile: args.prompt_file ? resolve(args.prompt_file) : null,
  output: args.output ? resolve(args.output) : null,
  quote: loaded.quote,
});

const sleep = (milliseconds) =>
  new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));

const main = async () => {
  const [command, ...rest] = process.argv.slice(2);
  if (!["quote", "preview", "generate"].includes(command)) {
    throw new Error(
      "Usage: openrouter-video.mjs <quote|preview|generate> [options]",
    );
  }

  const args = parseArgs(rest);
  const loaded = await loadModelAndQuote(args);
  const summary = requestSummary(args, loaded);
  console.log(JSON.stringify(summary, null, 2));

  if (!loaded.quote)
    throw new Error("Live model pricing could not be estimated; do not submit");
  if (command === "quote") return;

  const promptPath = resolve(requireArg(args, "prompt_file"));
  const firstFramePath = resolve(requireArg(args, "first_frame"));
  const outputPath = resolve(requireArg(args, "output"));
  if (!existsSync(promptPath))
    throw new Error(`Missing prompt file: ${promptPath}`);
  if (!loaded.model.supported_frame_images?.includes("first_frame")) {
    throw new Error(`${loaded.model.id} does not support a first frame`);
  }
  if (
    args.last_frame &&
    !loaded.model.supported_frame_images?.includes("last_frame")
  ) {
    throw new Error(`${loaded.model.id} does not support a last frame`);
  }
  imageDataUrl(firstFramePath);
  if (args.last_frame) imageDataUrl(args.last_frame);

  if (command === "preview") return;

  loadOpenRouterKey();
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY is not set in the environment or agent-skills root .env",
    );
  }

  const maximumCost = Number(requireArg(args, "max_cost_usd"));
  if (!Number.isFinite(maximumCost) || maximumCost < 0) {
    throw new Error("--max-cost-usd must be a non-negative number");
  }
  if (loaded.quote.estimatedCostUsd > maximumCost + 1e-9) {
    throw new Error(
      `Estimated cost $${loaded.quote.estimatedCostUsd.toFixed(6)} exceeds approved maximum $${maximumCost.toFixed(6)}`,
    );
  }

  const frameImages = [
    {
      type: "image_url",
      image_url: { url: imageDataUrl(firstFramePath) },
      frame_type: "first_frame",
    },
  ];
  if (args.last_frame) {
    frameImages.push({
      type: "image_url",
      image_url: { url: imageDataUrl(args.last_frame) },
      frame_type: "last_frame",
    });
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://github.com/mikecann/agent-skills",
    "X-Title": "mike-cartoon-broll",
  };
  const submitted = await fetchJson(VIDEO_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: loaded.model.id,
      prompt: readFileSync(promptPath, "utf8").trim(),
      resolution: loaded.resolution,
      duration: loaded.duration,
      aspect_ratio: loaded.aspectRatio,
      generate_audio: args.audio,
      frame_images: frameImages,
    }),
  });
  const pollingUrl = submitted.polling_url ?? `${VIDEO_URL}/${submitted.id}`;
  console.log(`Submitted ${submitted.id}`);

  let status = submitted;
  const pollInterval = Number(args.poll_interval_ms ?? 30000);
  const maxPolls = Number(args.max_polls ?? 40);
  for (let poll = 0; status.status !== "completed"; poll += 1) {
    if (["failed", "cancelled", "expired"].includes(status.status)) {
      throw new Error(
        `Generation ${status.status}: ${status.error ?? "Unknown error"}`,
      );
    }
    if (poll >= maxPolls)
      throw new Error(`Generation timed out after ${maxPolls} polls`);
    await sleep(pollInterval);
    status = await fetchJson(pollingUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    console.log(`Poll ${poll + 1}: ${status.status}`);
  }

  const downloadUrl =
    status.unsigned_urls?.[0] ?? `${VIDEO_URL}/${status.id}/content?index=0`;
  const content = await fetch(downloadUrl, {
    headers: downloadUrl.startsWith(VIDEO_URL)
      ? { Authorization: `Bearer ${apiKey}` }
      : undefined,
  });
  if (!content.ok) throw new Error(`Download failed: HTTP ${content.status}`);

  mkdirSync(dirname(outputPath), { recursive: true });
  const temporaryPath = `${outputPath}.partial`;
  writeFileSync(temporaryPath, new Uint8Array(await content.arrayBuffer()));
  renameSync(temporaryPath, outputPath);

  let generation = null;
  if (status.generation_id) {
    const generationUrl = new URL("https://openrouter.ai/api/v1/generation");
    generationUrl.searchParams.set("id", status.generation_id);
    generation = (
      await fetchJson(generationUrl, {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
    ).data;
  }

  const receipt = {
    generatedAt: new Date().toISOString(),
    ...summary,
    jobId: status.id,
    generationId: status.generation_id ?? null,
    provider: generation?.provider_name ?? null,
    actualCostUsd: status.usage?.cost ?? generation?.total_cost ?? null,
    generationTimeMilliseconds: generation?.generation_time ?? null,
  };
  writeFileSync(
    `${outputPath}.receipt.json`,
    `${JSON.stringify(receipt, null, 2)}\n`,
  );
  console.log(
    `Completed ${outputPath}; actual cost $${Number(receipt.actualCostUsd ?? 0).toFixed(6)}; generation time ${receipt.generationTimeMilliseconds ?? "unknown"}ms`,
  );
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
