import { colors } from './colors';

export const theme = {
  // Common spacing, radius, etc.
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

export const lightThemeVars = {
  '--background': colors.light.background,
  '--surface': colors.light.surface,
  '--primary': colors.light.primary,
  '--primary-hover': colors.light.primaryHover,
  '--accent': colors.light.accent,
  '--text-primary': colors.light.textPrimary,
  '--text-secondary': colors.light.textSecondary,
  '--text-muted': colors.light.textMuted,
  '--border': colors.light.borderSoft,
  '--border-hard': colors.light.borderHard,
  '--glass': colors.light.glass,
  '--shadow-soft': colors.light.shadowSoft,
  '--shadow-elevated': colors.light.shadowElevated,
  '--success': colors.light.success,
  '--danger': colors.light.danger,
};

export const darkThemeVars = {
  '--background': colors.dark.background,
  '--surface': colors.dark.surface,
  '--primary': colors.dark.primary,
  '--primary-hover': colors.dark.primaryHover,
  '--accent': colors.dark.accent,
  '--text-primary': colors.dark.textPrimary,
  '--text-secondary': colors.dark.textSecondary,
  '--text-muted': colors.dark.textMuted,
  '--border': colors.dark.borderSoft,
  '--border-hard': colors.dark.borderHard,
  '--glass': colors.dark.glass,
  '--shadow-soft': colors.dark.shadowSoft,
  '--shadow-elevated': colors.dark.shadowElevated,
  '--success': colors.dark.success,
  '--danger': colors.dark.danger,
};
