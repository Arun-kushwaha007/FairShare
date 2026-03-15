import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useAppTheme } from '../../theme/useAppTheme';
import { spacing } from '../../theme/spacing';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  style?: ViewStyle;
  loading?: boolean;
}

export function Button({ children, onPress, variant = 'primary', style, loading }: ButtonProps) {
  const { colors, isDark } = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: colors.primary,
          text: '#FFFFFF',
          shadow: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 102, 255, 0.2)',
        };
      case 'secondary':
        return {
          background: colors.surface,
          text: colors.primary,
          shadow: colors.elevation_low,
          border: colors.border,
        };
      case 'danger':
        return {
          background: colors.danger,
          text: '#FFFFFF',
          shadow: 'rgba(255, 23, 68, 0.2)',
        };
      case 'ghost':
        return {
          background: 'transparent',
          text: colors.primary,
          shadow: 'transparent',
        };
      default:
        return {
          background: colors.primary,
          text: '#FFFFFF',
          shadow: colors.elevation_low,
        };
    }
  };

  const v = getVariantStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        styles.wrapper,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: v.background,
            borderColor: v.border || 'transparent',
            borderWidth: v.border ? 1 : 0,
            // Skeuomorphic Shadow
            shadowColor: v.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 8,
            elevation: 4,
          },
          animatedStyle,
        ]}
      >
        <Text
          style={[
            styles.text,
            { color: v.text },
          ]}
        >
          {children}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
  },
  container: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2, // Back to standard letter spacing for better readability
  },
});
