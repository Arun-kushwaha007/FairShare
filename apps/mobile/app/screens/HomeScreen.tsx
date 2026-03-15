import React from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthStore } from '../store/authStore';
import { useGroupStore } from '../store/groupStore';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';
import { BalanceCard } from '../components/BalanceCard';
import { SectionHeader } from '../components/SectionHeader';
import { ActivityItem } from '../components/ActivityItem';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';

export function HomeScreen({ navigation }: { navigation: any }) {
  const user = useAuthStore((state) => state.user);
  const groups = useGroupStore((state) => state.groups);
  const { colors, typography } = useAppTheme();

  const quickActions = [
    { label: 'Add Expense', icon: 'plus-circle-outline' as const, color: colors.primary, onPress: () => navigation.navigate('AddExpense', { groupId: groups[0]?.id ?? '' }) },
    { label: 'Groups', icon: 'account-group-outline' as const, color: colors.accent, onPress: () => navigation.navigate('Groups') },
    { label: 'Settle Up', icon: 'handshake-outline' as const, color: colors.success, onPress: () => navigation.navigate('SettleUp', { groupId: groups[0]?.id ?? '' }) },
  ];

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[typography.bodyMedium, { color: colors.text_secondary }]}>Welcome back,</Text>
          <Text style={[typography.h2, { color: colors.text_primary, marginTop: 2 }]}>{user?.name ?? 'Friend'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Avatar name={user?.name ?? 'U'} size={48} />
        </TouchableOpacity>
      </View>

      {/* Balance Summary */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.summarySection}>
        <BalanceCard
          title="Total Balance"
          amount="$420.69"
          subtitle="You are owed"
          variant="success"
          icon="trending-up"
        />
      </Animated.View>

      {/* Quick Actions */}
      <SectionHeader title="Quick Actions" />
      <View style={styles.quickActions}>
        {quickActions.map((action, i) => (
          <Animated.View 
            key={action.label} 
            entering={FadeInDown.duration(400).delay(100 + i * 100)}
            style={styles.actionItem}
          >
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={action.onPress}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconBg, { backgroundColor: `${action.color}10` }]}>
                <MaterialCommunityIcons name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.text_primary }]}>{action.label}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {/* Recent Activity */}
      <SectionHeader 
        title="Recent Activity" 
        action="See all" 
        onActionPress={() => {}} 
      />
      <View style={styles.activityList}>
        {[1, 2, 3].map((item, i) => (
          <Animated.View 
            key={item} 
            entering={FadeInDown.duration(400).delay(400 + i * 100)}
          >
            <ActivityItem 
              title="Dinner at Joe's" 
              subtitle="Paid by you in Trip to Bali" 
              amount="$45.00"
              date="2h ago"
              icon="receipt"
            />
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
    marginTop: spacing.sm,
  },
  summarySection: {
    marginBottom: spacing.xxl,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actionItem: {
    flex: 1,
  },
  actionButton: {
    padding: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    gap: spacing.sm,
    // Soft shadow
    shadowColor: 'rgba(0,0,0,0.04)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  actionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  activityList: {
    gap: spacing.sm,
  },
});
