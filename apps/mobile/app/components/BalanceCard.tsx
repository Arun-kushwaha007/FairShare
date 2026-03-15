import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';
import { Card } from './ui/Card';

interface BalanceCardProps {
  title: string;
  amount: string;
  subtitle?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  variant?: 'default' | 'success' | 'danger';
  currency?: string;
}

export const BalanceCard = memo(function BalanceCard({
  title,
  amount,
  subtitle,
  icon = 'wallet',
  variant = 'default',
  currency = 'USD',
}: BalanceCardProps) {
  const { colors, typography } = useAppTheme();

  const accentColor =
    variant === 'success'
      ? colors.success
      : variant === 'danger'
        ? colors.danger
        : colors.primary;

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBg, { backgroundColor: `${accentColor}12` }]}>
          <MaterialCommunityIcons name={icon} size={22} color={accentColor} />
        </View>
        <Text style={[typography.caption, { color: colors.text_secondary }]}>
          {title}
        </Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[typography.h1, { color: colors.text_primary, marginBottom: 0 }]}>
          {amount}
        </Text>
        {subtitle ? (
          <View style={[styles.subtitleBadge, { backgroundColor: `${accentColor}12` }]}>
            <Text style={[styles.subtitleText, { color: accentColor }]}>
              {subtitle}
            </Text>
          </View>
        ) : null}
      </View>
      
      {/* 10% Brutalist Accent: Sharp bottom line for selected/primary card */}
      {variant !== 'default' && (
        <View style={[styles.brutalistAccent, { backgroundColor: accentColor }]} />
      )}
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: spacing.xl,
    gap: spacing.md,
    marginVertical: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  subtitleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  brutalistAccent: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});
