import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Button as PaperButton, ButtonProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/useAppTheme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

type Props = ButtonProps & {
  variant?: ButtonVariant;
};

export function Button({ variant = 'primary', style, ...props }: Props) {
  const { colors } = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const variantStyles: Record<ButtonVariant, { mode: ButtonProps['mode']; buttonColor?: string; textColor?: string }> = {
    primary: { mode: 'contained', buttonColor: colors.primary, textColor: '#FFFFFF' },
    secondary: { mode: 'outlined', textColor: colors.primary },
    danger: { mode: 'contained', buttonColor: colors.danger, textColor: '#FFFFFF' },
    ghost: { mode: 'text', textColor: colors.primary },
  };

  const vs = variantStyles[variant];

  return (
    <Animated.View style={animatedStyle}>
      <PaperButton
        {...props}
        mode={vs.mode}
        buttonColor={props.buttonColor ?? vs.buttonColor}
        textColor={props.textColor ?? vs.textColor}
        style={[{ borderRadius: 14 }, style as any]}
        contentStyle={{ paddingVertical: 4 }}
        labelStyle={{ fontWeight: '700', fontSize: 14 }}
        onPressIn={(event) => {
          scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
          props.onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scale.value = withSpring(1, { damping: 15, stiffness: 300 });
          props.onPressOut?.(event);
        }}
      />
    </Animated.View>
  );
}
