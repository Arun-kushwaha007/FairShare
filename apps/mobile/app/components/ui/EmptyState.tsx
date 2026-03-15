import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from './Avatar'; // Using theme context
import { useAppTheme as useTheme } from '../../theme/useAppTheme';
import { spacing } from '../../theme/spacing';
import { Button } from './Button';

interface EmptyStateProps {
  kind: 'no_groups' | 'no_expenses' | 'no_members' | 'error';
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const KIND_METADATA = {
  no_groups: { icon: 'account-group-outline', desc: "You haven't joined any groups yet." },
  no_expenses: { icon: 'cash-off', desc: "No expenses recorded in this group." },
  no_members: { icon: 'account-multiple-remove-outline', desc: "No members found." },
  no_activity: { icon: 'history', desc: "No activity recorded yet." },
  error: { icon: 'alert-circle-outline', desc: "Something went wrong. Please try again." },
};

export function EmptyState({ kind = 'error', title, description, actionLabel, onAction }: EmptyStateProps & { kind?: any }) {
  const { colors } = useTheme();
  const meta = KIND_METADATA[kind as keyof typeof KIND_METADATA] || KIND_METADATA.error;

  return (
    <View style={styles.container}>
      <View style={[styles.iconBg, { backgroundColor: `${colors.primary}10` }]}>
        <MaterialCommunityIcons name={meta.icon as any} size={48} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.text_primary }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.text_secondary }]}>
        {description || meta.desc}
      </Text>
      {actionLabel && onAction && (
        <Button variant="primary" onPress={onAction} style={styles.button}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    marginTop: spacing.xxxl,
  },
  iconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: 22,
  },
  button: {
    minWidth: 200,
  },
});
