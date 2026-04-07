import React from 'react';
import { StyleSheet, Text as RNText } from 'react-native';
import { formatCurrencyFromCents, type CurrencyCode } from '@fairshare/shared-types';
import { useAppTheme } from '../../theme/useAppTheme';

interface MoneyTextProps {
  cents: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'danger';
  currency?: CurrencyCode;
}

/**
 * Render a Text element showing a formatted currency amount.
 *
 * @param cents - Amount in cents as a string (e.g., `"150"` for $1.50)
 * @param size - One of `'sm' | 'md' | 'lg'`; controls the text font size
 * @param variant - One of `'default' | 'success' | 'danger'`; controls the text color
 * @param currency - Currency code used for formatting (defaults to `'USD'`)
 * @returns A React Native Text element displaying the formatted currency string; the same string is used for the accessibility label
 */
export function MoneyText({ cents, size = 'md', variant = 'default', currency = 'USD' }: MoneyTextProps) {
  const { colors } = useAppTheme();
  const amount = formatCurrencyFromCents(cents, currency);

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
      accessibilityLabel={amount}
    >
      {amount}
    </RNText>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});
