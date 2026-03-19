import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useAppTheme } from '../../theme/useAppTheme';
import { spacing } from '../../theme/spacing';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
}

export function Button({ children, onPress, variant = 'primary', style, loading }: ButtonProps) {
  const theme = useAppTheme();
  const { colors, shadows } = theme;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          gradient: colors.gradient,
          text: '#FFFFFF',
          shadow: shadows.soft,
        };
      case 'secondary':
        return {
          background: colors.cardElevated,
          text: colors.primary,
          shadow: shadows.soft,
          border: colors.border,
        };
      case 'danger':
        return {
          background: colors.danger,
          text: '#FFFFFF',
          shadow: shadows.soft,
        };
      case 'ghost':
        return {
          background: 'transparent',
          text: colors.primary,
          shadow: null,
        };
      default:
        return {
          background: colors.primary,
          text: '#FFFFFF',
          shadow: shadows.soft,
        };
    }
  };

  const v = getVariantStyles();

  const content = (
    <Animated.View
      style={[
        styles.container,
        !v.gradient && { backgroundColor: v.background },
        v.border && { borderColor: v.border, borderWidth: 1 },
        v.shadow,
        animatedStyle,
      ]}
    >
      <Text style={[styles.text, { color: v.text }]}>{loading ? 'Loading...' : children}</Text>
      <View style={[styles.highlight, { backgroundColor: colors.insetHighlight }]} />
    </Animated.View>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.96);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[styles.wrapper, style]}
      disabled={loading}
    >
      {v.gradient ? (
        <LinearGradient
          colors={v.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientWrapper}
        >
          {content}
        </LinearGradient>
      ) : (
        content
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientWrapper: {
    borderRadius: 16,
  },
  container: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    borderRadius: 16,
    position: 'relative',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 2,
    right: 2,
    height: 1,
    borderRadius: 8,
  },
});
