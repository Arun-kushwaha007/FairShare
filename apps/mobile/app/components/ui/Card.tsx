import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import { spacing } from '../../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'glass';
}

export function Card({ children, style, variant = 'default' }: CardProps) {
  const { colors, shadows, isDark } = useAppTheme();

  const getCardStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          bg: colors.cardElevated,
          shadow: shadows.elevated,
          border: 'transparent',
        };
      case 'glass':
        return {
          bg: colors.glass,
          shadow: shadows.soft,
          border: colors.cardBorder,
        };
      default:
        return {
          bg: colors.card,
          shadow: shadows.soft,
          border: colors.cardBorder,
        };
    }
  };

  const v = getCardStyles();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: v.border === 'transparent' ? 0 : 1,
          ...v.shadow,
        },
        style,
      ]}
    >
      {children}
      {/* Subtle skeuomorphic border/highlight for Dark Mode */}
      {isDark && (
        <View style={[styles.innerBorder, { borderColor: colors.insetHighlight }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24, // Rounder for Royal SaaS
    padding: spacing.lg,
    marginVertical: spacing.xs,
    position: 'relative',
    overflow: 'hidden',
  },
  innerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 0.5,
    borderRadius: 24,
    opacity: 0.2,
  }
});

