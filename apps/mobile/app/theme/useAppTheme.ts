import React from 'react';
import { useColorScheme } from 'react-native';
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { lightTheme, darkTheme } from './theme';
import { useThemeStore } from '../store/themeStore';

export type ThemeColors = typeof colors.light;
export type ThemeTypography = typeof typography;
export type ThemeSpacing = typeof spacing;
export type ThemeShadows = typeof lightTheme.shadows;

export function useAppTheme() {
  const systemColorScheme = useColorScheme();
  const themeMode = useThemeStore((state) => state.themeMode);
  
  const isDark = React.useMemo(() => {
    if (themeMode === 'system') return systemColorScheme === 'dark';
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);
  
  const theme = isDark ? darkTheme : lightTheme;
  
  return React.useMemo(() => ({
    isDark,
    colors: isDark ? colors.dark : colors.light,
    typography,
    spacing,
    shadows: theme.shadows,
  }), [isDark, theme.shadows]);
}
