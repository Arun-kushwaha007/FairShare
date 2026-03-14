import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Button as PaperButton, ButtonProps } from 'react-native-paper';
import { useAppTheme } from '../../theme/useAppTheme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

type Props = ButtonProps & {
  variant?: ButtonVariant;
};

export function Button({ variant = 'primary', style, ...props }: Props) {
  const { colors, isDark } = useAppTheme();
  const shadowOffset = useSharedValue(4);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: 4 - shadowOffset.value }, { translateY: 4 - shadowOffset.value }],
  }));

  const variantStyles: Record<ButtonVariant, { mode: ButtonProps['mode']; buttonColor?: string; textColor?: string; borderColor?: string }> = {
    primary: { mode: 'contained', buttonColor: colors.primary, textColor: isDark ? '#000000' : '#FFFFFF', borderColor: colors.border },
    secondary: { mode: 'outlined', buttonColor: colors.surface, textColor: colors.text_primary, borderColor: colors.border },
    danger: { mode: 'contained', buttonColor: colors.danger, textColor: '#FFFFFF', borderColor: colors.border },
    ghost: { mode: 'text', textColor: colors.text_primary },
  };

  const vs = variantStyles[variant];

  if (variant === 'ghost') {
    return (
      <PaperButton
        {...props}
        mode="text"
        textColor={props.textColor ?? vs.textColor}
        style={[{ borderRadius: 0 }, style as any]}
        labelStyle={{ fontWeight: '800', fontSize: 14, textTransform: 'uppercase' }}
      />
    );
  }

  return (
    <View style={styles.buttonContainer}>
      {/* Hard Shadow Layer */}
      <View style={[styles.shadow, { backgroundColor: colors.border, borderRadius: 2 }]} />
      
      <Animated.View style={[styles.animatedWrapper, animatedStyle]}>
        <PaperButton
          {...props}
          mode={vs.mode}
          buttonColor={props.buttonColor ?? vs.buttonColor}
          textColor={props.textColor ?? vs.textColor}
          style={[
            styles.button,
            { 
              borderRadius: 2, 
              borderWidth: 2, 
              borderColor: vs.borderColor ?? colors.border 
            },
            style as any
          ]}
          contentStyle={{ paddingVertical: 6 }}
          labelStyle={{ fontWeight: '900', fontSize: 14, textTransform: 'uppercase' }}
          onPressIn={(event) => {
            shadowOffset.value = withSpring(0, { damping: 20, stiffness: 300 });
            props.onPressIn?.(event);
          }}
          onPressOut={(event) => {
            shadowOffset.value = withSpring(4, { damping: 20, stiffness: 300 });
            props.onPressOut?.(event);
          }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'relative',
    marginBottom: 4,
    marginRight: 4,
  },
  shadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
  },
  animatedWrapper: {
    width: '100%',
  },
  button: {
    borderWidth: 2,
  },
});
