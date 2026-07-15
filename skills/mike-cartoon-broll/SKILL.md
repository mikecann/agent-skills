---
name: mike-cartoon-broll
description: Create short hand-drawn cartoon B-roll clips for Mike's tech-explainer videos using one raster start frame and a video model such as Seedance or Veo. Use for humorous character moments, object-led physical metaphors, visual jokes, or animated attention resets. Keep code, UI, schemas, and deterministic diagrams in motion graphics or real screen footage.
---

# Mike Cartoon B-Roll

Create short, silent cartoon inserts that break up talking-head footage. Use one
strong opening frame, then give the video model room to invent the progression.

## Style

Use `assets/cartoon-style-reference.png` as the authoritative visual-style
reference in every image-generation request. Treat its characters, objects,
poses, and composition as examples, not required scene content. Choose the cast
from the requested idea. A scene may include Mike, the robot, both, other
characters, or neither.

- Warm ivory paper with visible texture.
- Fine graphite-and-ink outlines with imperfect cross-hatching.
- Muted watercolor and gouache fills.
- Sparse editorial compositions with grounded shadows and negative space.
- Static wide or medium-wide camera and dry, understated humour.
- If Mike appears, use his black cap, charcoal T-shirt, dark jeans, and black
  sneakers.
- If the friendly robot appears, use its rounded weathered teal body, cream face
  panel, black oval eyes, mustard antenna ball and chest medallion, and segmented
  dark limbs.

## Pick the Scene

Choose one physical metaphor, visual joke, or character beat that loosely
supports the narration. It does not need to illustrate every sentence.

- Keep the scene sparse. Include only characters and props that serve the idea.
- Do not add Mike or the robot merely because they appear in the style reference.
- Use one action for six seconds or two simple beats for eight seconds.
- Never exceed eight seconds unless the user explicitly asks.

## Workflow

1. Split the request into one item for every script segment or explicit part the
   user asked to illustrate. Preserve the exact script lines for each item.
2. Describe one simple scene for each item.
3. For every item, generate the 16:9 raster start frame and draft the loose motion
   brief in parallel. Use the bundled style reference for the frame. Let the
   video model choose the exact staging, timing, reactions, and ending.
4. Inspect the returned frame at full resolution. Fix identity, anatomy,
   object-count, fake-text, or composition problems. Reconcile the draft motion
   brief against the actual frame so it only names characters and props that are
   visibly present.
5. Present one compact approval block for every requested item:

   ```text
   Script lines: <exact script segment or explicit user request>
   Video filename: <descriptive-slug>.mp4
   First frame: <show the generated image>
   Motion: <the brief instructions for the video model>
   ```

   Replace the first-frame placeholder with the actual inline image, not only a
   file path or description.

   After all blocks, state the model, resolution, duration, audio setting, cost
   per clip, and total cost once. Do not bury the approval bundle in extra prose.
6. Wait for approval. If the user explicitly asks to skip approval, proceed after
   the same internal frame check.
7. Generate directly from each start frame. Do not create or supply a last frame.
8. Play each full result at normal speed and inspect a dense filmstrip. Reject
   identity drift, duplicated props, broken anatomy, camera jumps, or style drift.
9. Never silently pay for a retry. Preserve the failed take and state the retry
   cost.
10. Normalize each generated output to silent H.264 at the agreed native
    resolution and 30fps. Write the video as
    `<VIDEO>/source/generated/<video-filename>.mp4`, where `<VIDEO>` is the video
    project root and `<video-filename>` exactly matches the approval block. Create
    `source/generated` if it does not exist.
11. After generation, give the user a clickable Markdown link to the absolute
    `<VIDEO>/source/generated` folder so they can open it in Finder and view the
    videos.

Keep working files together:

```text
generated-video/<clip-slug>/
  first-frame.png
  prompt.txt
  output.source.mp4
  output.source.mp4.receipt.json
```

Write each output video to:

```text
<VIDEO>/source/generated/<video-filename>.mp4
```

Never put frames, prompts, raw provider files, or receipts in `source/generated`.

## Video Defaults

- Model: `bytedance/seedance-2.0`
- Resolution: native 1080p
- Duration: six seconds, or eight seconds for two beats
- Aspect ratio: 16:9
- Audio: disabled
- Jobs: sequential unless the user explicitly requests parallel generation

Use `scripts/openrouter-video.mjs` to fetch live pricing and cap every paid job.
Do not rely on remembered prices. Use Veo only when the user prefers lower cost
or faster generation.

Example motion brief:

```text
Use the supplied frame as the opening composition and visual style. The neat
row of existing dominoes begins falling, but the oversized sticky note catches
the chain at the last moment. Let the action progress naturally and choose a
satisfying understated ending.

Preserve the warm paper, ink-and-watercolor texture, existing subjects, and
existing props. Static camera, one continuous shot, restrained hand-drawn
motion. No cuts, unrequested characters, duplicated objects, generated text,
flat vector simplification, 3D rendering, watermark, or audio.
```

## Checklist

- [ ] The scene earns its place as an attention reset.
- [ ] The cast and props come from the idea, not from the style reference.
- [ ] One clear start frame matches the bundled style reference.
- [ ] The frame is clean when inspected at full resolution.
- [ ] A frame and draft motion brief were created in parallel for every requested
      script segment.
- [ ] Each motion brief was reconciled against its actual frame.
- [ ] Every requested segment has its own simple approval block.
- [ ] The motion brief gives direction without choreographing every moment.
- [ ] No last frame is supplied.
- [ ] Live model, duration, resolution, audio setting, and cost are confirmed.
- [ ] The complete motion is watched before delivery.
- [ ] The final is silent H.264 at the agreed native resolution and 30fps.
- [ ] The output video is saved to
      `<VIDEO>/source/generated/<video-filename>.mp4`.
- [ ] The response links to the absolute `source/generated` folder.
