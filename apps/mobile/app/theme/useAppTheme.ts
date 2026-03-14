import React from 'react';
import { useColorScheme } from 'react-native';
import { colors } from './colors';
import { useThemeStore } from '../store/themeStore';

export type ThemeColors = typeof colors.light;

export function useAppTheme(): { isDark: boolean; colors: ThemeColors } {
  const systemColorScheme = useColorScheme();
  const themeMode = useThemeStore((state) => state.themeMode);
  
  const isDark = React.useMemo(() => {
    if (themeMode === 'system') return systemColorScheme === 'dark';
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);
  
  return React.useMemo(() => ({
    isDark,
    colors: isDark ? colors.dark : colors.light,
  }), [isDark]);
}
