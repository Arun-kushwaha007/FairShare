import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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

export function HomeScreen({ navigation }: { navigation: any }) {
  const user = useAuthStore((state) => state.user);
  const groups = useGroupStore((state) => state.groups);
  const { colors } = useAppTheme();

  const quickActions = [
    { label: 'Add Expense', icon: 'plus-circle', color: colors.primary, onPress: () => navigation.navigate('AddExpense', { groupId: groups[0]?.id ?? '' }) },
    { label: 'Create Group', icon: 'account-group', color: colors.secondary, onPress: () => navigation.navigate('CreateGroup') },
    { label: 'Settle Up', icon: 'handshake', color: colors.success, onPress: () => navigation.navigate('SettleUp', { groupId: groups[0]?.id ?? '' }) },
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
          <Text style={[styles.welcome, { color: colors.text_secondary }]}>Welcome back,</Text>
          <Text style={[styles.name, { color: colors.text_primary }]}>{user?.name ?? 'Friend'}</Text>
        </View>
        <MaterialCommunityIcons name="bell-outline" size={24} color={colors.text_primary} />
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
            <Button
              variant="secondary"
              onPress={action.onPress}
              style={styles.actionButton}
            >
              <View style={styles.actionContent}>
                <MaterialCommunityIcons name={action.icon as any} size={20} color={action.color} />
                <Text style={styles.actionLabel}>{action.label}</Text>
              </View>
            </Button>
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
            />
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  welcome: {
    fontSize: 14,
    fontWeight: '500',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  summarySection: {
    marginBottom: spacing.xl,
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
    paddingHorizontal: 0,
    height: 80,
  },
  actionContent: {
    alignItems: 'center',
    gap: 8,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  activityList: {
    gap: spacing.sm,
  },
});
