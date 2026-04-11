import { colors, ColorMode } from './colors';
import { layoutSpacing, spacing } from './spacing';
import { typography } from './typography';

export const radii = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  pill: '9999px',
} as const;

export const shadows = {
  glass: '0px 14px 40px rgba(0,0,0,0.25)',
  hover: '0px 18px 52px rgba(0,0,0,0.35)',
} as const;

type ThemeVariableMap = Record<string, string>;

const baseVars: ThemeVariableMap = {
  '--fs-radius-sm': radii.sm,
  '--fs-radius-md': radii.md,
  '--fs-radius-lg': radii.lg,
  '--fs-radius-xl': radii.xl,
  '--fs-radius-pill': radii.pill,
  '--fs-shadow-glass': shadows.glass,
  '--fs-shadow-hover': shadows.hover,
  '--fs-space-xs': spacing.xs,
  '--fs-space-sm': spacing.sm,
  '--fs-space-md': spacing.md,
  '--fs-space-lg': spacing.lg,
  '--fs-space-xl': spacing.xl,
  '--fs-space-2xl': spacing['2xl'],
  '--fs-space-3xl': spacing['3xl'],
  '--fs-layout-page-x': layoutSpacing.pageX,
  '--fs-layout-page-y': layoutSpacing.pageY,
  '--fs-layout-card-padding': layoutSpacing.cardPadding,
  '--fs-layout-gap': layoutSpacing.gap,
  '--fs-font-sans': typography.fontSans,
  '--fs-font-display': typography.fontDisplay,
  '--fs-font-mono': typography.fontMono,
};

export const themeVars: Record<ColorMode, ThemeVariableMap> = {
  light: {
    ...baseVars,
    '--fs-background': colors.light.background,
    '--fs-surface': colors.light.surface,
    '--fs-card': colors.light.card,
    '--fs-card-solid': colors.light.cardSolid,
    '--fs-primary': colors.light.primary,
    '--fs-primary-hover': colors.light.primaryHover,
    '--fs-accent': colors.light.accent,
    '--fs-accent-soft': colors.light.accentSoft,
    '--fs-text-primary': colors.light.textPrimary,
    '--fs-text-secondary': colors.light.textSecondary,
    '--fs-text-muted': colors.light.textMuted,
    '--fs-border': colors.light.borderSoft,
    '--fs-border-hard': colors.light.borderHard,
    '--fs-glass': colors.light.glass,
    '--fs-shadow-soft': colors.light.shadowSoft,
    '--fs-shadow-elevated': colors.light.shadowElevated,
    '--fs-success': colors.light.success,
    '--fs-danger': colors.light.danger,
    '--fs-warning': colors.light.warning,
  },
  dark: {
    ...baseVars,
    '--fs-background': colors.dark.background,
    '--fs-surface': colors.dark.surface,
    '--fs-card': colors.dark.card,
    '--fs-card-solid': colors.dark.cardSolid,
    '--fs-primary': colors.dark.primary,
    '--fs-primary-hover': colors.dark.primaryHover,
    '--fs-accent': colors.dark.accent,
    '--fs-accent-soft': colors.dark.accentSoft,
    '--fs-text-primary': colors.dark.textPrimary,
    '--fs-text-secondary': colors.dark.textSecondary,
    '--fs-text-muted': colors.dark.textMuted,
    '--fs-border': colors.dark.borderSoft,
    '--fs-border-hard': colors.dark.borderHard,
    '--fs-glass': colors.dark.glass,
    '--fs-shadow-soft': colors.dark.shadowSoft,
    '--fs-shadow-elevated': colors.dark.shadowElevated,
    '--fs-success': colors.dark.success,
    '--fs-danger': colors.dark.danger,
    '--fs-warning': colors.dark.warning,
  },
};

function cssFromVars(vars: ThemeVariableMap): string {
  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
}

export function buildThemeCss(mode: ColorMode): string {
  return cssFromVars(themeVars[mode]);
}

export const themeStylesheet = `:root{${buildThemeCss('dark')}}[data-theme=\"light\"]{${buildThemeCss('light')}}`;

export const motion = {
  transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const designTokens = {
  colors,
  spacing,
  layoutSpacing,
  typography,
  radii,
  shadows,
  motion,
};

export type DesignTokens = typeof designTokens;
