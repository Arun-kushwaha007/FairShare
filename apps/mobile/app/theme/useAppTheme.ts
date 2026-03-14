import React from 'react';
import { useColorScheme } from 'react-native';
import { colors } from './colors';

export type ThemeColors = typeof colors.light;

export function useAppTheme(): { isDark: boolean; colors: ThemeColors } {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return React.useMemo(() => ({
    isDark,
    colors: isDark ? colors.dark : colors.light,
  }), [isDark]);
}
