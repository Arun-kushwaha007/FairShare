import React, { memo } from 'react';
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

export const BalanceCard = memo(function BalanceCard({
  title,
  amount,
  subtitle,
  icon = 'wallet',
  variant = 'default',
}: BalanceCardProps) {
  const { colors } = useAppTheme();

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
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.elevation_low,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 8,
          elevation: 4,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconBg, { backgroundColor: `${accentColor}15` }]}>
          <MaterialCommunityIcons name={icon} size={22} color={accentColor} />
        </View>
        <Text style={[styles.title, { color: colors.text_secondary }]}>
          {title}
        </Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.amount, { color: colors.text_primary }]}>
          {amount}
        </Text>
        {subtitle ? (
          <View style={[styles.subtitleBadge, { backgroundColor: `${accentColor}15` }]}>
            <Text style={[styles.subtitleText, { color: accentColor }]}>
              {subtitle}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.md,
    marginVertical: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  amount: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subtitleText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
