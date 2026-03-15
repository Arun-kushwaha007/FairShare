import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../../theme/useAppTheme';

export function Separator({ brutal = false }: { brutal?: boolean }) {
  const { colors } = useAppTheme();
  
  return (
    <View 
      style={{
        height: brutal ? 2 : 1,
        backgroundColor: brutal ? colors.borderHard : colors.border,
        marginVertical: 16,
        opacity: brutal ? 1 : 0.5,
      }} 
    />
  );
}
