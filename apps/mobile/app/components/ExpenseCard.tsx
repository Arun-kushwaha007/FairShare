import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';
import { Card } from './ui/Card';
import { Avatar } from './ui/Avatar';

interface ExpenseCardProps {
  description: string;
  amount: string;
  payerName: string;
  payerInitials: string;
  participantCount: number;
  date: string;
  onPress?: () => void;
}

export const ExpenseCard = memo(function ExpenseCard({
  description,
  amount,
  payerName,
  payerInitials,
  participantCount,
  date,
  onPress,
}: ExpenseCardProps) {
  const { colors, typography, isDark } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityLabel={`Expense: ${description}, ${amount}`}
      accessibilityRole="button"
    >
      <Card variant="glass" style={styles.card}>
        <View style={styles.topRow}>
          <Avatar name={payerName} size={44} />
          <View style={styles.descriptionContainer}>
            <Text style={[typography.h3, { color: colors.text_primary }]} numberOfLines={1}>
              {description}
            </Text>
            <Text style={[typography.bodyMedium, { color: colors.text_secondary, marginTop: 2 }]}>
              paid by <Text style={{ fontWeight: '700', color: colors.primary }}>{payerName}</Text>
            </Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={[typography.h3, { color: colors.text_primary, textAlign: 'right' }]}>
              {amount}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border, opacity: isDark ? 0.3 : 1 }]} />

        <View style={styles.bottomRow}>
          <View style={[styles.metaItem, { backgroundColor: `${colors.accent}12` }]}>
            <MaterialCommunityIcons name="account-multiple-outline" size={14} color={colors.accent} />
            <Text style={[styles.metaText, { color: colors.accent, fontWeight: '700' }]}>
              {participantCount} members
            </Text>
          </View>
          <Text style={[typography.caption, { color: colors.muted, opacity: 0.8 }]}>
            {date}
          </Text>
        </View>
        
        {/* 10% Brutalist Accent: Subtle left border for high-value or specific items if needed, 
            here we just use a clean minimalist layout with skeuomorphic glass effect */}
      </Card>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  descriptionContainer: {
    flex: 1,
  },
  amountContainer: {
    minWidth: 80,
  },
  divider: {
    height: 1,
    marginVertical: spacing.lg,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaText: {
    fontSize: 12,
  },
});
