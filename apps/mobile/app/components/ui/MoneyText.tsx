import React from 'react';
import { StyleSheet, Text as RNText } from 'react-native';
import { useAppTheme } from '../../theme/useAppTheme';

interface MoneyTextProps {
  cents: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'danger';
}

export function MoneyText({ cents, size = 'md', variant = 'default' }: MoneyTextProps) {
  const { colors } = useAppTheme();
  const amount = Number(cents) / 100;

  const colorMap = {
    default: colors.text_primary,
    success: colors.success,
    danger: colors.danger,
  };

  const sizeMap = {
    sm: 14,
    md: 18,
    lg: 28,
  };

  return (
    <RNText
      style={[
        styles.text,
        {
          color: colorMap[variant],
          fontSize: sizeMap[size],
        },
      ]}
      accessibilityLabel={`$${amount.toFixed(2)}`}
    >
      ${amount.toFixed(2)}
    </RNText>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});
