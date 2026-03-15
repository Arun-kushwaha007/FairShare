export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
} as const;

export const layoutSpacing = {
  pageX: '1.5rem', // 24px
  pageY: '2.5rem', // 40px
  cardPadding: '1.25rem', // 20px
  gap: '1rem', // 16px
} as const;

export type Spacing = typeof spacing;
export type LayoutSpacing = typeof layoutSpacing;
