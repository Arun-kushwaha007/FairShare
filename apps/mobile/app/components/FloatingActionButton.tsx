import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

export function FloatingActionButton({ onPress, icon = 'plus' }: FloatingActionButtonProps) {
  const { colors, shadows } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.container, shadows.elevated]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <MaterialCommunityIcons name={icon} size={30} color="#FFFFFF" />
          {/* Skeuomorphic highlight */}
          <View style={[styles.highlight, { backgroundColor: colors.insetHighlight }]} />
        </LinearGradient>
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
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'transparent',
  },
  gradient: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  highlight: {
    position: 'absolute',
    top: 2,
    left: 10,
    right: 10,
    height: 4,
    opacity: 0.6,
    borderRadius: 20,
  }
});
