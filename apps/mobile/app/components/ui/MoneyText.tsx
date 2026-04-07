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
 * Renders a Text element that displays a currency amount formatted from a cents string and sets the accessibility label to the same formatted string.
 *
 * @param cents - Amount in cents as a string (for example, `"150"` represents $1.50)
 * @param currency - ISO currency code used for formatting (defaults to `'USD'`)
 * @returns A React element that renders the formatted currency string
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
