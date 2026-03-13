export const typography = {
  fontSans: [
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'Segoe UI',
    'Roboto',
    'Helvetica',
    'Arial',
    'Noto Sans',
    'Apple Color Emoji',
    'Segoe UI Emoji',
  ].join(', '),
  fontMono: [
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'monospace',
  ].join(', '),
} as const;

export type Typography = typeof typography;

