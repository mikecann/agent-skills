# Motion graphics — style guide

This file is the source of truth for visual style across every clip. Every clip TSX imports tokens from `src/theme.ts`. Never hardcode colors, fonts, or timing.

## Identity

These clips overlay a tech-explainer voiceover for the Convex YouTube channel. The viewer is **listening**; the clip reinforces what the voice is saying with a clean visual cue. The viewer is not reading.

## Look

- **Dark editor-grey background.** Vertical gradient `colors.bg` -> `colors.bgGradientEnd` (`#1F1F1F` -> `#161616`), subtle fade. This is VS Code Dark Modern's editor colour — the goal is "feels native to a developer's environment".
- **Soft gray text (`colors.text`, `#CCCCCC`)** — never pure white. Easier on the eye and matches VS Code's foreground.
- **Three interchangeable accents** in `colors.accents`:
  - `colors.accents.teal` (`#4EC9B0`) — VS Code's "types" colour
  - `colors.accents.blue` (`#569CD6`) — VS Code's "keywords" colour
  - `colors.accents.amber` (`#DCDCAA`) — VS Code's "functions" colour
- **Pick freely from the accent palette.** They look coherent together because they're all from the same syntax theme. Mix within a clip (e.g. a 3-step list rotates teal -> blue -> amber) or stick to one per clip — both are valid. Never use accents for body text.
- **Semantic colours** — only when something has true semantic meaning, not for decoration:
  - `colors.good` (`#6A9955`, VS Code's "comments") for "the right answer / safe path"
  - `colors.bad` (`#F44747`, VS Code's "errors") for "the broken / insecure thing"

## Type

- Display headlines are big (`fonts.sizes.headline` = 140px at 4K). Use sparingly — one headline per clip max.
- Body text is small relative to the canvas. 4K is a huge surface; readable text is smaller than you think.
- Monospace (`fonts.mono`) for code only. Never for body.
- The typography tokens are exported as `fonts` (not `type`) to avoid shadowing the TypeScript `type` keyword. Import as `import { colors, fonts, motion } from '../theme'`.

## Motion

- **Spring physics** is the default entrance. Three named presets in `motion.springs`:
  - `snappy` — energetic emphasis. Intro headlines, "ZERO" reveals, things that should pop.
  - `gentle` — steady, controlled builds. Code reveals, step-by-step lists, anything you want to feel calm and readable.
  - `dramatic` — slow ramp + satisfying overshoot. Big punctuating moments, the answer-to-a-question beat.
- **Variants in the same clip should use different springs** so they feel different in motion, not just composition.
- **No pure fades** as the primary entrance. Combine opacity with scale or position.
- **Stagger** related elements by 4-8 frames so they read as a sequence, not a clump.
- **Hold** the final state for at least 30 frames (1 second) before the clip ends — viewers need time to absorb.
- **Easing** for non-spring interpolations: `motion.ease` (a slow-in, slow-out cubic-bezier).

## Composition

- **One idea per clip.** If your hand reaches for a second concept, split into a second clip.
- **Safe area**: keep important content inside `layout.safe` (240px at 4K) from each edge.
- **No headers, no footers, no logos, no clip numbers, no progress bars, no tickers.** This is overlay content — nothing the viewer didn't ask for.
- **Anchor the eye.** Every clip should have one clear focal point.

## Code reveals

Code blocks are common in tech explainers. Treat them carefully:

- Use monospace at `fonts.sizes.code` (48px at 4K) or larger.
- **Animate the reveal** — typewriter line-by-line, or stagger-in by line. Never just fade the whole block.
- **Highlight the relevant line** — that's the part the voice is referring to. For code reveals specifically, leaning into the VS-Code-native mapping reads well: `colors.accents.blue` for keywords, `colors.accents.teal` for types/identifiers, `colors.accents.amber` for function names. The "important" line gets stronger contrast (e.g. brighter text, a left border in `colors.accents.amber`).
- **Strip irrelevant code.** Show 5-10 meaningful lines, not the full file. The viewer can't read 30 lines in 5 seconds.
- Indent at 2 spaces. Use a slight tint behind code (`colors.surface`) so it reads as a panel, not floating text.

## Diagrams

When the script asks for a diagram (e.g. `<aside>show a diagram on screen briefly</aside>`):

- Use `@remotion/shapes` for boxes and circles, `@remotion/paths` for connecting arrows.
- Label sparingly. Two or three words per node, not full sentences.
- Animate the layout in: nodes scale-spring in, then arrows draw on with a path-length interpolation.
- Pick one accent (e.g. `colors.accents.teal`) for the path/node the voice is currently describing. If the diagram has multiple highlighted elements over time, rotate accents — first node teal, second blue, third amber — to signal progression.

## Variant strategy

When generating 3 variants per clip, each variant must differ along at least one of:

- **Composition** — centered vs split-screen vs grid vs sequential timeline
- **Reveal language** — typewriter, scale-spring, slide-from-edge, mask-wipe, stagger-in
- **Visual metaphor** — diagram, code reveal, abstract shape, side-by-side comparison, "screen frame" mock

Do not generate 3 variants that differ only in color or timing. If you can't think of 3 distinct directions, propose 2 and say why — better fewer good variants than 3 near-identical ones.

## Examples

```tsx
// Good — theme tokens, named spring preset, deliberate accent pick, no clutter
import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { colors, fonts, motion } from '../theme';

export const ClipGood = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame, fps, config: motion.springs.snappy });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${colors.bg}, ${colors.bgGradientEnd})`,
        fontFamily: fonts.display,
        color: colors.text,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1
        style={{
          fontSize: fonts.sizes.headline,
          transform: `scale(${t})`,
          color: colors.accents.teal,
          margin: 0,
        }}
      >
        One Big Idea
      </h1>
    </AbsoluteFill>
  );
};
```

```tsx
// Bad — hardcoded values, fade-only entrance, three competing ideas, no focal point
export const ClipBad = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#000', color: '#fff' }}>
      <h1 style={{ opacity: frame / 30 }}>First idea</h1>
      <h2 style={{ opacity: frame / 60 }}>Second idea fighting for attention</h2>
      <p style={{ opacity: frame / 90 }}>And a third explainer paragraph</p>
    </AbsoluteFill>
  );
};
```
