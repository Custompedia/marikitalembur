// Glyphs for FeatureIcon, drawn as strokes on a 96-unit grid inside a dark disc of radius 35.
export const glyphs = {
  input: '<path d="M38 30h13l9 9v27H38Z" /><path d="M51 30v9h9" /><path d="M44 50h10M44 57h10" />',
  review: '<path d="M27 48c5-9 12-14 21-14s16 5 21 14c-5 9-12 14-21 14s-16-5-21-14Z" /><circle cx="48" cy="48" r="6" />',
  export: '<path d="M48 56V31" /><path d="M39 40l9-9 9 9" /><path d="M34 52v12h28V52" />',
  map: '<path d="M35 36h26M35 36l13 25M61 36 48 61" /><circle cx="35" cy="36" r="5" fill="#0b0912" /><circle cx="61" cy="36" r="5" fill="#0b0912" /><circle cx="48" cy="61" r="5" fill="#0b0912" />',
  learn: '<path d="M48 38c-6-4-12-5-18-4v26c6-1 12 0 18 4 6-4 12-5 18-4V34c-6-1-12 0-18 4Z" /><path d="M48 38v26" />',
  test: '<path d="M41 30h14" /><path d="M44 30v12L33 61c-1 3 0 5 3 5h24c3 0 4-2 3-5L52 42V30" /><path d="M38 55h20" />',
  apply: '<path d="M30 48h24" /><path d="M46 40l8 8-8 8" /><path d="M56 32h9v32h-9" />',
  repeat: '<path d="M62 42a15 15 0 0 0-27-5" /><path d="M34 54a15 15 0 0 0 27 5" /><path d="M35 29v8h8M61 67v-8h-8" />',
  chat: '<path d="M31 33h34v23H47l-9 8v-8h-7Z" /><path d="M39 42h18M39 49h11" />',
  agree: '<path d="M33 49l10 10 20-21" />',
  box: '<path d="M48 30l17 9v19l-17 9-17-9V39Z" /><path d="M31 39l17 9 17-9M48 48v19" />',
  send: '<path d="M30 47l36-15-10 35-9-13Z" /><path d="M47 54l19-22" />',
  team: '<circle cx="41" cy="41" r="6" /><circle cx="58" cy="43" r="5" /><path d="M29 64c1-8 6-12 12-12s11 4 12 12" /><path d="M53 54c1.5-1 3.2-1.5 5-1.5 5 0 8.5 4 9.5 10" />',
  mail: '<path d="M31 36h34v24H31Z" /><path d="M31 37l17 13 17-13" />',
  calendar: '<path d="M32 36h32v28H32Z" /><path d="M32 45h32M40 30v10M56 30v10" /><path d="M40 53h4M52 53h4M40 59h4" />',
} as const;

export type IconName = keyof typeof glyphs;
