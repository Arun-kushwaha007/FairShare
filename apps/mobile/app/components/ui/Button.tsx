import React from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Button as PaperButton, ButtonProps } from 'react-native-paper';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type Props = ButtonProps & {
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, { mode: ButtonProps['mode']; buttonColor?: string; textColor?: string }> = {
  primary: { mode: 'contained' },
  secondary: { mode: 'outlined' },
  danger: { mode: 'contained', buttonColor: '#B91C1C', textColor: '#FFFFFF' },
};

export function Button({ variant = 'primary', ...props }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const style = variantStyles[variant];

  return (
    <Animated.View style={animatedStyle}>
      <PaperButton
        {...props}
        mode={style.mode}
        buttonColor={props.buttonColor ?? style.buttonColor}
        textColor={props.textColor ?? style.textColor}
        onPressIn={(event) => {
          scale.value = withSpring(0.97, { damping: 15, stiffness: 220 });
          props.onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scale.value = withSpring(1, { damping: 15, stiffness: 220 });
          props.onPressOut?.(event);
        }}
      />
    </Animated.View>
  );
}
