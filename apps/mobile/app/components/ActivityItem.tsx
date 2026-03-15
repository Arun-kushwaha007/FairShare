import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';

interface ActivityItemProps {
  title: string;
  subtitle: string;
  amount: string;
  date: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

export function ActivityItem({ title, subtitle, amount, date, icon = 'cash' }: ActivityItemProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.iconBg, { backgroundColor: `${colors.primary}10` }]}>
        <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text_primary }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.text_secondary }]} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: colors.text_primary }]}>
          {amount}
        </Text>
        <Text style={[styles.date, { color: colors.text_secondary }]}>
          {date}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
  },
  date: {
    fontSize: 10,
    marginTop: 2,
  },
});
