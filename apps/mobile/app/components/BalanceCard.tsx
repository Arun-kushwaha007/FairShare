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
    <View style={styles.wrapper}>
      <View style={[styles.shadow, { backgroundColor: colors.border }]} />
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.header}>
          <View style={[styles.iconBg, { backgroundColor: accentColor }]}>
            <MaterialCommunityIcons name={icon} size={24} color={colors.background} />
          </View>
          <Text style={[styles.title, { color: colors.text_secondary }]}>
            {title.toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.content}>
          <Text style={[styles.amount, { color: colors.text_primary }]}>
            {amount}
          </Text>
          {subtitle ? (
            <View style={[styles.subtitleBadge, { backgroundColor: accentColor }]}>
              <Text style={[styles.subtitleText, { color: colors.background }]}>
                {subtitle.toUpperCase()}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginBottom: 8,
    marginRight: 8,
  },
  shadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    backgroundColor: '#000000',
  },
  card: {
    padding: spacing.lg,
    borderWidth: 3,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBg: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  amount: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  subtitleText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
