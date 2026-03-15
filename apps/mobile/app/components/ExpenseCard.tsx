import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';

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
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: 'rgba(0,0,0,0.05)',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 4,
          elevation: 2,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Expense: ${description}, ${amount}`}
      accessibilityRole="button"
    >
      <View style={styles.topRow}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{payerInitials}</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={[styles.description, { color: colors.text_primary }]} numberOfLines={1}>
            {description}
          </Text>
          <Text style={[styles.payer, { color: colors.text_secondary }]}>
            by {payerName}
          </Text>
        </View>
        <Text style={[styles.amount, { color: colors.text_primary }]}>
          {amount}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.bottomRow}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="account-multiple-outline" size={14} color={colors.primary} />
          <Text style={[styles.metaText, { color: colors.text_secondary }]}>
            {participantCount} involved
          </Text>
        </View>
        <Text style={[styles.date, { color: colors.text_secondary }]}>
          {date}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#FFFFFF',
  },
  descriptionContainer: {
    flex: 1,
  },
  description: {
    fontSize: 15,
    fontWeight: '600',
  },
  payer: {
    fontSize: 12,
    marginTop: 2,
  },
  amount: {
    fontSize: 17,
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.md,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  date: {
    fontSize: 12,
  },
});
