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
  const { colors, isDark } = useAppTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isDark ? colors.card : colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Expense: ${description}, ${amount}`}
      accessibilityRole="button"
    >
      <View style={styles.row}>
        {/* Payer Avatar */}
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{payerInitials}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[styles.description, { color: colors.text_primary }]}
            numberOfLines={1}
          >
            {description}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.meta, { color: colors.text_secondary }]}>
              {payerName}
            </Text>
            <View style={styles.dot} />
            <View style={styles.chipRow}>
              <MaterialCommunityIcons
                name="account-multiple"
                size={13}
                color={colors.text_secondary}
              />
              <Text style={[styles.meta, { color: colors.text_secondary }]}>
                {participantCount}
              </Text>
            </View>
            <View style={styles.dot} />
            <Text style={[styles.meta, { color: colors.text_secondary }]}>
              {date}
            </Text>
          </View>
        </View>

        {/* Amount */}
        <Text style={[styles.amount, { color: colors.text_primary }]}>
          {amount}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  row: {
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
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meta: {
    fontSize: 12,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#9CA3AF',
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
