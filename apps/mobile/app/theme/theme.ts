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
    surfaceVariant: colors.light.cardElevated,
    onSurface: colors.light.text_primary,
    onSurfaceVariant: colors.light.text_secondary,
    outline: colors.light.border,
    error: colors.light.danger,
    secondary: colors.light.accent,
  },
  typography,
  spacing,
  shadows: {
    soft: {
      shadowColor: colors.light.shadowSoft,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 8,
    },
    elevated: {
      shadowColor: colors.light.shadowElevated,
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 1,
      shadowRadius: 40,
      elevation: 16,
    }
  }
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.dark.primary,
    background: colors.dark.background,
    surface: colors.dark.surface,
    surfaceVariant: colors.dark.cardElevated,
    onSurface: colors.dark.text_primary,
    onSurfaceVariant: colors.dark.text_secondary,
    outline: colors.dark.border,
    error: colors.dark.danger,
    secondary: colors.dark.accent,
  },
  typography,
  spacing,
  shadows: {
    soft: {
      shadowColor: colors.dark.shadowSoft,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 1,
      shadowRadius: 30,
      elevation: 10,
    },
    elevated: {
      shadowColor: colors.dark.shadowElevated,
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 1,
      shadowRadius: 50,
      elevation: 18,
    }
  }
};

export type AppTheme = typeof lightTheme;
