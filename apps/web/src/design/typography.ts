export const typography = {
  fontSans: ['var(--font-sans)', '\"Manrope\"', '\"Space Grotesk\"', 'sans-serif'].join(', '),
  fontDisplay: ['var(--font-display)', '\"Space Grotesk\"', '\"Manrope\"', 'sans-serif'].join(', '),
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
  weights: {
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    black: 800,
  },
  sizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '22px',
    display: '36px',
  },
} as const;

export type Typography = typeof typography;
