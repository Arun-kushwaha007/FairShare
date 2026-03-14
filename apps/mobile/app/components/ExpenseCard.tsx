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
    <View style={styles.wrapper}>
      <View style={[styles.shadow, { backgroundColor: colors.border }]} />
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityLabel={`Expense: ${description}, ${amount}`}
        accessibilityRole="button"
      >
        <View style={styles.topRow}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.background }]}>{payerInitials}</Text>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={[styles.description, { color: colors.text_primary }]} numberOfLines={1}>
              {description.toUpperCase()}
            </Text>
            <Text style={[styles.payer, { color: colors.text_secondary }]}>
              BY {payerName.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.amount, { color: colors.text_primary }]}>
            {amount}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.bottomRow}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="account-multiple" size={16} color={colors.primary} />
            <Text style={[styles.metaText, { color: colors.text_secondary }]}>
              {participantCount} INVOLVED
            </Text>
          </View>
          <Text style={[styles.date, { color: colors.text_secondary }]}>
            {date.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginBottom: spacing.lg,
    marginRight: spacing.sm,
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
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  avatarText: {
    fontWeight: '900',
    fontSize: 16,
  },
  descriptionContainer: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  payer: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 1,
  },
  amount: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  divider: {
    height: 2,
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
    gap: 6,
  },
  metaText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  date: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
