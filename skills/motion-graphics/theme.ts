// Motion-graphics theme tokens.
// Every clip imports from here. Edit values here, not in clip files.
// Copied verbatim into each new project's src/theme.ts at scaffold time.

export const colors = {
  // Background gradient — VS Code Dark Modern editor grey, subtly fading darker.
  bg: '#1F1F1F',
  bgGradientEnd: '#161616',
  // Surface for panels (code boxes, callout backgrounds).
  surface: '#2A2A2A',
  // Soft gray text — easier on the eye than pure white.
  text: '#CCCCCC',
  textMuted: '#858585',
  // Accent palette — three interchangeable emphasis colors taken from
  // VS Code Dark Modern's syntax theme. Use whichever fits the moment;
  // mix freely across or within clips for variety. See STYLE.md for guidance.
  accents: {
    teal: '#4EC9B0',   // VS Code "types"
    blue: '#569CD6',   // VS Code "keywords"
    amber: '#DCDCAA',  // VS Code "functions"
  },
  // Semantic colors — only for true semantic meaning, not decoration.
  good: '#6A9955',     // VS Code "comments"
  bad: '#F44747',      // VS Code "errors"
} as const;

// Typography tokens. Named `fonts` (not `type`) so it doesn't shadow the TS keyword.
export const fonts = {
  display: 'GeistSans, Inter, system-ui, sans-serif',
  body: 'GeistSans, Inter, system-ui, sans-serif',
  mono: 'GeistMono, "JetBrains Mono", "Fira Code", monospace',
  sizes: {
    headline: 140,
    title: 96,
    body: 56,
    caption: 36,
    code: 48,
  },
} as const;

// Motion tokens. Use the named spring presets so variants differ on motion
// language, not just colour. Pick `snappy` for energetic emphasis (intro
// headlines, sharp reveals), `gentle` for code reveals and steady builds,
// `dramatic` for big punctuating moments with a satisfying overshoot.
export const motion = {
  springs: {
    snappy: { damping: 14, mass: 0.7, stiffness: 180, overshootClamping: false },
    gentle: { damping: 22, mass: 1, stiffness: 110, overshootClamping: true },
    dramatic: { damping: 10, mass: 1.2, stiffness: 90, overshootClamping: false },
  },
  ease: [0.2, 0.8, 0.2, 1] as const,
  durations: {
    fast: 8,
    base: 12,
    slow: 20,
  },
} as const;

export const layout = {
  width: 3840,
  height: 2160,
  fps: 30,
  safe: 240,
} as const;
