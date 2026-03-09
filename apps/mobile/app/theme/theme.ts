import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.light.primary,
    background: colors.light.background,
    surface: colors.light.surface,
    surfaceVariant: colors.light.card,
    onSurface: colors.light.text_primary,
    onSurfaceVariant: colors.light.text_secondary,
    outline: colors.light.border,
    error: colors.light.danger,
  },
  typography,
  spacing,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.dark.primary,
    background: colors.dark.background,
    surface: colors.dark.surface,
    surfaceVariant: colors.dark.card,
    onSurface: colors.dark.text_primary,
    onSurfaceVariant: colors.dark.text_secondary,
    outline: colors.dark.border,
    error: colors.dark.danger,
  },
  typography,
  spacing,
};

export type AppTheme = typeof lightTheme;

