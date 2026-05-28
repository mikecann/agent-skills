---
name: motion-graphics
description: Generate silent motion-graphic MP4 clips for a tech-explainer YouTube video using Remotion. The clips are overlay B-roll the user drops onto a voiceover timeline. Use when the user is working from a video folder and says "build motion graphics for this video", "make motion graphics", "add a motion graphic for this section", "render this part as a clip", or wants to scaffold a Remotion project from a markdown script.
---

# Motion Graphics

Produce silent MP4 motion-graphic clips from a markdown video script using Remotion. The clips are overlay B-roll the user drops onto a 4K 30fps voiceover timeline in their video editor.

## When to Use

Run this from a video folder — the folder holding source material for one YouTube video, e.g. `C:\videos\rls\`. Use when the user:

- says "build motion graphics for this video"
- pastes or points at a script and wants overlay clips made from it
- mid-edit, says "I want this part to be a motion graphic" — re-invoke and add one clip

Do not use this for full standalone explainer videos. The output is overlay content for an existing voice track.

## Output Spec

Every clip the skill produces is:

- 3840 x 2160 (4K), 30 fps, H.264
- silent — no audio track. The user has their own voice recording.
- duration matches the natural read time of the script section it covers (see Phase 5). Most clips end up 2-15 seconds; longer is allowed but consider splitting (see "Long clips" below).
- rendered to `motion-graphics/out/<clip-id>-{A,B,C}.mp4`

3 variants are rendered per clip. The user picks one. The other two MP4s move to `out/_rejected/` (do not delete — keep for recovery). All three `.tsx` files stay in `src/clips/`.

## Workflow

### Phase 1 — Locate the script (pre-flight gate)

Before scaffolding or any other work, confirm a script exists in the video folder.

1. List `.md` files in the video folder (top level only, not in subfolders).
2. If exactly one `.md` file is found, treat it as the script and confirm the filename with the user.
3. If multiple `.md` files are found, ask the user which one is the script.
4. If **none** is found, **stop immediately**. Tell the user verbatim:
   > I couldn't find a `.md` script in `<folder>`. Either drop the script there as a `.md` file, or paste the script content in chat now and I'll save it to `<folder>/script.md`.

   Then wait. If the user pastes the content, save it to `<folder>/script.md` first. Do not proceed past this phase until a script is on disk in the video folder.
5. Once located, never modify the source file — it's the source of truth. The skill will work against a copy inside the Remotion project (see Phase 2).

### Phase 2 — Set up the project (once per video)

Run from the video folder so the subfolder is created in place.

1. Create `motion-graphics/` subfolder.
2. Scaffold a blank Remotion project inside it:
   ```bash
   npx create-video@latest --yes --blank --no-tailwind motion-graphics
   ```
3. Copy the located script into the project as the canonical working copy. Use the right command for the shell:
   ```bash
   # bash / git-bash
   cp <located-script>.md motion-graphics/script.md
   ```
   ```powershell
   # PowerShell
   Copy-Item <located-script>.md motion-graphics/script.md
   ```
   The original file in the video folder remains untouched.
4. Install the official Remotion AI skill into the new project so its rules are available next time an agent works here:
   ```bash
   cd motion-graphics && npx skills add remotion-dev/skills
   ```
5. Install supporting Remotion packages:
   ```bash
   npm install @remotion/shapes @remotion/transitions @remotion/google-fonts @remotion/paths @remotion/animation-utils @remotion/layout-utils
   ```
6. Copy the skill's bundled assets into the new project:
   - `skills/motion-graphics/theme.ts` -> `motion-graphics/src/theme.ts`
   - `skills/motion-graphics/STYLE.md` -> `motion-graphics/STYLE.md`
7. Read `STYLE.md` and `src/theme.ts` before writing any clip code. Read the official Remotion skill's `SKILL.md` and any `rules/*.md` that match the clips you're about to build (e.g. `rules/text-animations.md`, `rules/transitions.md`, `rules/spring-physics.md`).

### Phase 3 — Gather external context

The script often references URLs (docs, blog posts, tldraw boards, GitHub repos, diagrams). Before proposing clips, try to fetch what's relevant so clip ideas can build on real reference material.

1. Scan `script.md` for URLs (markdown links, bare URLs, "see X" references). **Ignore URLs inside `<aside>` blocks** — those belong to the user's editor-side B-roll, not the clips this skill generates. Exception: if you've decided to propose a clip immediately adjacent to an aside and the URL inside the aside genuinely supports that clip's visual, treat it as load-bearing and fetch it.
2. For each URL that's plausibly visual or referential context (not just a citation), attempt `WebFetch`.
3. **If fetch returns meaningful content** (article text, README, diagram description), keep it as context for clip design.
4. **If fetch fails or returns nothing useful** (auth-walled, client-rendered SPA like tldraw/Figma/Excalidraw, 404), **stop and ask the user**:
   > I can't access `<url>` — it looks like a `<reason: client-rendered board / auth-walled / 404>`. Options:
   > - Export the content as a PNG/SVG and drop it in `<video-folder>/refs/`, then tell me the filename.
   > - Describe what's on it in chat.
   > - Skip it if it's not load-bearing for the clips.
5. Save any fetched text context to `motion-graphics/refs/<slug>.md` and any user-provided images to `motion-graphics/refs/`. Reference these in clip notes files.

If no URLs are present or none need fetching, skip this phase and move on.

### Phase 4 — Propose clips

Parse `script.md` and produce a candidate clip list. **The bar is illustrative value**: every clip you propose must answer "yes" to *"does a visual genuinely help the viewer understand what the voice is saying here?"*. If the answer is "not really, it would just be filler", do not propose a clip there.

**Selection rules** in priority order:

1. **Intro hook** — propose 1 clip for the opening 2-3 sentences. The intro is a special case: even if there's no concrete concept to illustrate, a punchy typographic title-card works because the goal is attention, not comprehension.
2. **Code blocks** — propose 1 clip per meaningful code block (3+ lines). Code reveals are pure illustration.
3. **Enumerated/sequential content** — lists of steps, recipes, ordered procedures. The "update schema -> migrate -> tighten schema" pattern is a perfect candidate.
4. **Concept comparisons** — "User A vs User B", before/after, "Firebase does X, Convex does Y", architecture diagrams.
5. **Concrete hypotheticals** — "imagine if...", "let's say we've got...", anything that sets up a scenario you can show.
6. **Outro/takeaway** — only if there's a concrete idea to visualise. *"We have zero downtime"* is sentiment, not concept — skip. *"Three rules to remember"* is concept — propose.

**Things to skip — do not propose clips for**:

- **`<aside>` blocks**. These are the user's editing notes to themselves about B-roll they will overlay manually in their editor (e.g. *"show sweaty balmer gif"*, *"point to the hat"*). They are **not** briefs for the motion-graphics skill. Treat them as comments — read them for context, do not generate clips from them.
- **Pure sentiment / opinion** — "this is really powerful", "I love this", "trust me".
- **Conversational filler** — "anyways", "let me explain", "okay so".
- **Sections where the spoken words are the whole point** — a personal story, a joke, a meta-comment about the video. Audio-only is correct here.

**Present the proposed list** to the user as a table. Each entry:

- clip id (`clip-01`, `clip-02`, ...) — these are also the Remotion composition IDs (see Phase 5 for naming rules).
- 1-2 lines of the script section it covers (quoted)
- one-line visual concept
- estimated duration in seconds (based on natural read time — see Phase 5 step 4)

Ask: anything to add, drop, or rephrase? Wait for explicit approval before generating.

### Phase 5 — Generate 3 variants per approved clip

For each approved clip:

1. Write a notes file at `motion-graphics/src/clips/notes/clip-NN.notes.md`:
   ```
   # Clip NN - <short slug>

   ## Script section
   <verbatim paste>

   ## Visual brief
   <one paragraph plain-English description of what the clip shows>

   ## Duration
   <word_count> words / 2.5 wps + 0.7s buffer = <N> seconds = <N*30> frames

   ## Variants
   - A: <one-line distinguisher>
   - B: <one-line distinguisher>
   - C: <one-line distinguisher>

   ## Chosen variant
   <filled in by user later>

   ## Revisions
   <appended over iterations>
   ```
2. Write 3 component files. **Filenames** can use underscores (e.g. `src/clips/Clip01_IntroA.tsx`) but **Remotion composition IDs** can only contain `[a-zA-Z0-9-]` — use dashes for variant suffixes. Each variant must be **meaningfully different** (see Variant Strategy).
3. Each clip file imports tokens from `../theme`:
   ```tsx
   import { colors, fonts, motion } from '../theme';
   ```
   Never hardcode colors, fonts, or timing. **Use different `motion.springs.*` presets across variants** (`snappy` / `gentle` / `dramatic`) so they feel different in motion language, not just composition.
4. **Set `durationInFrames` to match natural read time.** The clip should fully animate within the time the user would naturally read the script section out loud. Default formula:
   ```
   read_seconds = word_count / 2.5
   buffer_seconds = 0.7   # lets the final state breathe
   durationInFrames = ceil((read_seconds + buffer_seconds) * 30)
   ```
   The user can hold the final frame longer in their editor, but the clip shouldn't run longer than the spoken section.

   **Long clips (>15s):** if the formula yields more than ~15 seconds, pause and ask the user before generating:
   > This section reads as `<N>` seconds. Should I (a) make one long clip with phased animation, (b) split it into 2-3 shorter clips, or (c) accept the long single clip?
   
   Default suggestion is (b) — splitting — because a 20s+ motion graphic is hard to design as a single cohesive piece and is usually two ideas wearing a trenchcoat.
5. Register all 3 variants in `src/Root.tsx` as `<Composition>` entries with `width={3840} height={2160} fps={30}`. Composition `id` props must use dashes only:
   ```tsx
   <Composition id="clip-01-a" component={Clip01IntroA} durationInFrames={120} ... />
   <Composition id="clip-01-b" component={Clip01IntroB} durationInFrames={120} ... />
   <Composition id="clip-01-c" component={Clip01IntroC} durationInFrames={120} ... />
   ```
6. **Type-check before rendering.** 4K renders take minutes; surfacing TypeScript errors first costs seconds:
   ```bash
   # from inside motion-graphics/
   npx tsc --noEmit
   ```
   Fix everything it reports (including unused imports) before moving on.
7. Render each. **Run from inside `motion-graphics/`** — the render command uses the current working directory's Remotion config:
   ```bash
   # from inside motion-graphics/
   npx remotion render clip-01-a --codec=h264 out/clip-01-A.mp4
   npx remotion render clip-01-b --codec=h264 out/clip-01-B.mp4
   npx remotion render clip-01-c --codec=h264 out/clip-01-C.mp4
   ```
8. Report the 3 MP4 paths to the user and ask them to pick one.

### Phase 6 — User picks; losers archived

When the user picks A/B/C:

1. Move the two unpicked MP4s to `out/_rejected/`. Do not delete.
2. Update `clip-NN.notes.md` "Chosen variant" line.
3. Leave all three `.tsx` files in `src/clips/` — they're cheap to keep and useful if the user reverses the decision.

### Phase 7 — Revisions

When the user asks for changes to a chosen clip:

1. Read `clip-NN.notes.md` first — it has the brief and prior revisions.
2. Edit the chosen variant file only. Don't touch the rejected siblings.
3. Re-render with the same output name (overwrites).
4. Append the revision to the notes file with what changed and why.

### Phase 8 — Mid-edit additions

When the user re-invokes the skill and says "add a clip for this paragraph":

1. Append a new entry to the clip list with the next id.
2. Run Phase 5 for just that clip.

## Variant Strategy

When generating 3 variants per clip, each variant must differ along at least one of:

- **Composition** — centered vs split-screen vs grid vs sequential timeline
- **Reveal language** — typewriter, scale-spring, slide-from-edge, mask-wipe, stagger-in
- **Visual metaphor** — diagram, code reveal, abstract shape, side-by-side comparison, "screen frame" mock
- **Motion preset** — pair each variant with a different `motion.springs.*` (`snappy` / `gentle` / `dramatic`) so the cadence feels different, not just the layout

Do not generate 3 variants that differ only in colour or timing. If you can't think of 3 distinct directions, say so and propose 2 — better fewer good variants than 3 near-identical ones.

## Style Rules

`STYLE.md` (copied into the project at scaffold time) is the source of truth. Re-read it at the start of each session.

Headline rules to keep in mind while coding:

- **No headers, footers, logos, tickers, or clip numbers on screen.** Overlay content only.
- **Not text-heavy.** If a single moment shows more than ~15 words, redesign. The viewer is listening; the clip reinforces, it doesn't restate.
- **One idea per clip.** If two ideas fight, split into two clips.
- **Spring motion by default.** Pure fades are weak — combine opacity with scale or position.

## Constraints

- Never render with audio. Strip any audio component before rendering.
- Always render 3 variants on first generation unless the user explicitly asks for fewer.
- Never modify `script.md`.
- Never delete a rejected variant — TSX stays in `src/clips/`, MP4 moves to `out/_rejected/`.
- Never skip the per-clip notes file. It carries context across sessions.
- If a script section is narrative-only and a visual would just be filler, say so and skip it instead of generating noise.

## File Layout

```
<video folder>/
  motion-graphics/
    script.md
    package.json
    remotion.config.ts
    STYLE.md
    src/
      Root.tsx
      theme.ts
      clips/
        Clip01_IntroA.tsx
        Clip01_IntroB.tsx
        Clip01_IntroC.tsx
        Clip03_DiagramA.tsx
        ...
        notes/
          clip-01.notes.md
          clip-03.notes.md
    out/
      clip-01-A.mp4
      clip-03-A.mp4
      _rejected/
        clip-01-B.mp4
        clip-01-C.mp4
```

## Bad vs Good

```text
Bad: "Here are 3 variants of the diagram clip" — all three use the same centered layout with different accent colors.

Good: "Variant A: split-screen User A | User B with typewriter code reveal underneath. Variant B: centered Firebase-style hierarchy diagram with the insecure path highlighted in red. Variant C: sequential timeline showing request -> DB query -> policy check arrows."
```

```text
Bad: A clip that repeats the entire spoken sentence as on-screen text.

Good: A clip that shows one keyword or visual cue that reinforces the sentence. The viewer is listening, not reading.
```

```tsx
// Bad: hardcoded values, fade-only, multiple competing ideas
export const ClipBad = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#000', color: '#fff' }}>
      <h1 style={{ opacity: frame / 30 }}>First idea</h1>
      <h2 style={{ opacity: frame / 60 }}>Second idea fighting for attention</h2>
    </AbsoluteFill>
  );
};

// Good: theme tokens, named spring preset, deliberate accent pick
import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { colors, fonts, motion } from '../theme';

export const ClipGood = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame, fps, config: motion.springs.snappy });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${colors.bg}, ${colors.bgGradientEnd})`,
      fontFamily: fonts.display,
      color: colors.text,
    }}>
      <h1 style={{
        fontSize: fonts.sizes.headline,
        transform: `scale(${t})`,
        color: colors.accents.teal,
      }}>
        One Big Idea
      </h1>
    </AbsoluteFill>
  );
};
```

## Checklist

- [ ] script saved to `motion-graphics/script.md`
- [ ] Remotion project scaffolded under `motion-graphics/`
- [ ] official Remotion skill installed in the project
- [ ] theme.ts + STYLE.md copied from this skill into the project
- [ ] URLs in the script were fetched (or the user was asked) before clip proposal
- [ ] `<aside>` blocks were treated as editor notes and *not* turned into clips
- [ ] every proposed clip passes the "does a visual actually help here?" test
- [ ] proposed clip list reviewed with the user before any rendering
- [ ] composition IDs in `Root.tsx` use dashes only (no underscores)
- [ ] `durationInFrames` per clip matches natural read time of the script section
- [ ] every clip has 3 meaningfully distinct variants (or a clear note saying fewer made sense)
- [ ] variants use *different* `motion.springs.*` presets, not just different layouts
- [ ] every clip has a notes file at `src/clips/notes/`
- [ ] rejected variants moved to `out/_rejected/`, TSX files kept in place
- [ ] every render is silent, 3840x2160, 30fps, H.264
