import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

export function FloatingActionButton({ onPress, icon = 'plus' }: FloatingActionButtonProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: colors.primary,
            shadowColor: isDark ? 'rgba(0, 0, 0, 0.5)' : colors.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name={icon} size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xxl,
  },
  container: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
