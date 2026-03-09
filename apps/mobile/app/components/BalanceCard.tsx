import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';

interface BalanceCardProps {
  title: string;
  amount: string;
  subtitle?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  variant?: 'default' | 'success' | 'danger';
}

export function BalanceCard({
  title,
  amount,
  subtitle,
  icon = 'wallet',
  variant = 'default',
}: BalanceCardProps) {
  const { colors, isDark } = useAppTheme();

  const accentColor =
    variant === 'success'
      ? colors.success
      : variant === 'danger'
        ? colors.danger
        : colors.primary;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark
            ? `${accentColor}18`
            : `${accentColor}0A`,
          borderColor: isDark ? `${accentColor}30` : `${accentColor}20`,
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.iconBg,
            {
              backgroundColor: `${accentColor}20`,
            },
          ]}
        >
          <MaterialCommunityIcons
            name={icon}
            size={22}
            color={accentColor}
          />
        </View>
      </View>
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.text_secondary },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.amount,
            { color: colors.text_primary },
          ]}
        >
          {amount}
        </Text>
        {subtitle ? (
          <Text
            style={[
              styles.subtitle,
              { color: colors.text_secondary },
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {},
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
});
