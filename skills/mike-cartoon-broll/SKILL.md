---
name: mike-cartoon-broll
description: Create short hand-drawn cartoon B-roll clips for Mike's tech-explainer videos using one raster start frame and a video model such as Seedance or Veo. Use for humorous character moments, object-led physical metaphors, visual jokes, or animated attention resets. Keep code, UI, schemas, and deterministic diagrams in motion graphics or real screen footage.
---

# Mike Cartoon B-Roll

Create short cartoon inserts that break up talking-head footage. Use one strong
opening frame, then give the video model room to invent the progression and
scene-appropriate audio.

## Style

Use `assets/cartoon-style-reference.png` as the authoritative visual-style
reference in every image-generation request. Treat its characters, objects,
poses, and composition as examples, not required scene content. Choose the cast
from the requested idea. A scene may include Mike, the robot, both, other
characters, or neither. In each frame prompt, list the allowed subjects and say
the reference controls rendering only, not scene content.

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

## Preserve Meaning

Before scene ideation, extract the minimum semantic anchors needed for the point
to survive. Do not turn every clause into a requirement:

- Must show: only the causally necessary actors, including who initiates the
  action and who is affected. Treat an explicitly named team practice, workflow,
  or real-world setting as required when it is part of the claim rather than
  incidental background.
- Must happen: the essential action, who acts on whom, cause, and result.
- Must change: any essential before-and-after contrast, role change, or emotional
  reversal.

Use the full script for context. Treat words such as `used to`, `now`, `but`,
`because`, `rather than`, and `instead` as prompts to check for a required change
or cause, not as automatic duration rules.

Assume the narration remains audible beneath the B-roll. Let it carry exact
wording, lists, setup, and experimental controls. The picture should add the one
causal action or reaction that makes the point memorable.

## Pick the Scene

First form the simplest literal scene internally as a meaning check. Then choose
one physical-metaphor candidate as well. Pick the clearer, more memorable scene,
literal or metaphorical, that preserves every semantic anchor. Humour may
compress the narration, but it must not change the actors, agency, cause, result,
setting, or required change. The scene need not depict every sentence, but it
must preserve the segment's core relationship and change.

Fidelity means preserving the core causal claim, not staging every clause or a
controlled experiment. A metaphor may replace technical objects when it still
shows the necessary instruction, action, and result. It may transform props
inside a required setting, but it must not replace that setting or practice.

- Keep the scene sparse. Include only characters and props that serve the idea.
- Do not add Mike or the robot merely because they appear in the style reference.
- Never turn an externally caused problem into the affected subject causing the
  problem itself.
- A visual joke based on jargon or an idiom is valid when it still shows the real
  instruction, action, and result. Reject it when the pun replaces the process or
  required setting.
- Do not repeat script wording as generated text or explanatory placards unless
  the user explicitly asks for it. Prefer visible action and expressive props.
- Prefer one decisive physical action over split screens, duplicated comparison
  subjects, diagrams, or explanatory placards.
- Use one continuous action for six seconds, even when it includes a simple cause
  and result. Use two beats over eight seconds only when two distinct states,
  roles, or comparisons must be shown separately for the meaning to survive.
- Never exceed eight seconds unless the user explicitly asks.

## Workflow

1. Split the request into one item for every script segment or explicit part the
   user asked to illustrate. Preserve the exact script lines for each item.
2. Extract and write the semantic anchors before describing a scene. Record who
   initiates the action and who is affected when the relationship is directional.
3. Form a literal baseline and one physical-metaphor candidate. Choose the
   stronger scene only after checking that it preserves the same actors, agency,
   cause, result, setting, and change.
4. For every item, generate the 16:9 raster start frame and draft the loose motion
   brief in parallel from the same anchors. Use the bundled reference for visual
   style only. Let the video model choose the exact timing, reactions, and ending.
5. Inspect the returned frame at full resolution. Fix identity, anatomy,
   object-count, fake-text, or composition problems. Reconcile the frame and
   motion brief against both the anchors and each other. Regenerate the frame if
   the frame and motion together drop an anchor.
6. Present one compact approval block for every requested item:

   ```text
   Script lines: <exact script segment or explicit user request>
   Preserves: <one sentence stating the required relationship or change>
   Video filename: <descriptive-slug>.mp4
   First frame: <show the generated image>
   Motion: <the brief instructions for the video model>
   ```

   Replace the first-frame placeholder with the actual inline image, not only a
   file path or description.

   After all blocks, state the model, resolution, duration, audio setting, cost
   per clip, and total cost once. Do not bury the approval bundle in extra prose.
7. Wait for approval. If the user explicitly asks to skip approval, proceed after
   the same internal frame check.
8. Generate directly from each start frame. Do not create or supply a last frame.
9. Review each full result visually at normal speed and inspect a dense filmstrip.
   Reject identity drift, duplicated props, broken anatomy, camera jumps, or
   style drift. Do not gate delivery or retry on generated audio; preserve it for
   editing.
10. Never silently pay for a retry. Preserve the failed take and state the retry
   cost.
11. Normalize each generated output to H.264 video at the agreed native
    resolution and 30fps, preserving the generated audio as AAC. Write it as
    `<VIDEO>/source/generated/<video-filename>.mp4`, where `<VIDEO>` is the video
    project root and `<video-filename>` exactly matches the approval block. Create
    `source/generated` if it does not exist.
12. After generation, give the user a clickable Markdown link to the absolute
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
- Audio: generated
- Jobs: sequential unless the user explicitly requests parallel generation

Use `scripts/openrouter-video.mjs` with `--audio` to fetch live pricing and cap
every paid job. Do not rely on remembered prices. Use `--no-audio` only when the
user explicitly requests a silent clip. Use Veo only when the user prefers lower
cost or faster generation.

Example motion brief:

```text
Use the supplied frame as the opening composition and visual style. The neat
row of existing dominoes begins falling, but the oversized sticky note catches
the chain at the last moment. Let the action progress naturally and choose a
satisfying understated ending.

Preserve the warm paper, ink-and-watercolor texture, existing subjects, and
existing props. Static camera, one continuous shot, restrained hand-drawn
motion. Generate subtle natural sound effects that match the visible action, but
no speech unless requested. No cuts, unrequested characters, duplicated objects,
generated text, flat vector simplification, 3D rendering, or watermark.
```

## Checklist

- [ ] The scene earns its place as an attention reset.
- [ ] Semantic anchors were extracted before scene ideation.
- [ ] A literal baseline was used to verify the meaning; the final scene preserves
      every required actor, agency, cause, result, change, and setting.
- [ ] The affected subject has not been made responsible for an externally caused
      problem.
- [ ] The scene communicates through action and props without unnecessary
      generated text.
- [ ] The cast and props come from the idea, not from the style reference.
- [ ] One clear start frame matches the bundled style reference.
- [ ] The frame is clean when inspected at full resolution.
- [ ] A frame and draft motion brief were created in parallel for every requested
      script segment.
- [ ] Each frame and motion brief were reconciled against the semantic anchors.
- [ ] Every requested segment has its own approval block with `Preserves:`.
- [ ] The motion brief gives direction without choreographing every moment.
- [ ] No last frame is supplied.
- [ ] Live model, duration, resolution, audio setting, and cost are confirmed.
- [ ] The complete motion is reviewed visually before delivery.
- [ ] The final is H.264 at the agreed native resolution and 30fps with generated
      audio preserved as AAC.
- [ ] The output video is saved to
      `<VIDEO>/source/generated/<video-filename>.mp4`.
- [ ] The response links to the absolute `source/generated` folder.
