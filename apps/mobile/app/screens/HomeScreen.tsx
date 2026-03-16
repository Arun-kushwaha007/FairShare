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
import { Avatar } from '../components/ui/Avatar';
import { groupService } from '../services/group.service';
import type { ActivityDto } from '@fairshare/shared-types';
import { ActivityItem } from '../components/ActivityItem';
import { useToastStore } from '../store/toastStore';
import { Image } from 'react-native';

const LOGO_SOURCE = require('../assets/images/logo.png');


export function HomeScreen({ navigation }: { navigation: any }) {
  const user = useAuthStore((state) => state.user);
  const groups = useGroupStore((state) => state.groups);
  const { colors, typography } = useAppTheme();
  const [summary, setSummary] = React.useState<{ totalBalanceCents: string } | null>(null);
  const [activities, setActivities] = React.useState<ActivityDto[]>([]);
  const [loading, setLoading] = React.useState(true);
  const toast = useToastStore((state) => state.show);

  const loadData = React.useCallback(async () => {
    try {
      const [summaryData, activityData] = await Promise.all([
        groupService.userSummary(),
        groupService.userActivity(0, 5),
      ]);
      setSummary(summaryData);
      setActivities(activityData.items);
    } catch (err) {
      console.error(err);
      toast('Failed to sync your vibes');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  const quickActions = [
    { label: 'Split it', icon: 'plus-circle-outline' as const, color: colors.primary, onPress: () => navigation.navigate('AddExpense', { groupId: groups[0]?.id ?? '' }) },
    { label: 'Groups', icon: 'account-group-outline' as const, color: colors.accent, onPress: () => navigation.navigate('Groups') },
    { label: 'Settle Up', icon: 'handshake-outline' as const, color: colors.success, onPress: () => navigation.navigate('SettleUp', { groupId: groups[0]?.id ?? '' }) },
  ];

  const totalBalance = Number(summary?.totalBalanceCents ?? 0) / 100;
  const balanceLabel = totalBalance >= 0 ? 'Securing the bag' : 'Lowkey in debt';
  const balanceVariant = totalBalance >= 0 ? 'success' : 'danger';
  const balanceIcon = totalBalance >= 0 ? 'trending-up' : 'trending-down';

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <Image 
            source={LOGO_SOURCE} 
            style={styles.logo} 
            resizeMode="contain" 
          />
          <View>
            <Text style={[typography.bodyMedium, { color: colors.text_secondary }]}>Yo, welcome back ✌️</Text>
            <Text style={[typography.h2, { color: colors.text_primary, marginTop: 2 }]}>{user?.name ?? 'Bestie'}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Avatar name={user?.name ?? 'U'} size={48} />
        </TouchableOpacity>
      </View>

      {/* Balance Summary */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.summarySection}>
        <BalanceCard
          title="The Bag 💰"
          amount={`$${Math.abs(totalBalance).toFixed(2)}`}
          subtitle={balanceLabel}
          variant={balanceVariant}
          icon={balanceIcon}
        />
      </Animated.View>

      {/* Quick Actions */}
      <SectionHeader title="Fast Moves" />
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
        title="Recent Activity ☕" 
        action="See all" 
        onActionPress={() => navigation.navigate('Activity')} 
      />
      <View style={styles.activityList}>
        {activities.length > 0 ? (
          activities.map((activity, i) => (
            <Animated.View 
              key={activity.id} 
              entering={FadeInDown.duration(400).delay(400 + i * 100)}
            >
              <ActivityItem 
                title={activity.type.replace('_', ' ')} 
                subtitle={`${activity.actorUserId} in group`} 
                amount={activity.metadata?.totalAmountCents ? `$${(Number(activity.metadata.totalAmountCents) / 100).toFixed(2)}` : undefined}
                date={new Date(activity.createdAt).toLocaleDateString()}
                icon="receipt"
              />
            </Animated.View>
          ))
        ) : (
          <Text style={[typography.bodyMedium, { color: colors.text_secondary, textAlign: 'center', marginTop: spacing.lg }]}>
            No tea to spill yet.
          </Text>
        )}
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
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logo: {
    width: 54,
    height: 54,
    borderRadius: 14,
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
