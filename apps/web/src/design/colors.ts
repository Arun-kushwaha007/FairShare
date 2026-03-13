export const colors = {
  background: '#0F172A',
  surface: '#111827',
  card: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.08)',

  primary: '#6366F1',
  success: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',

  text_primary: '#F9FAFB',
  text_secondary: '#9CA3AF',
} as const;

export type Colors = typeof colors;

