import React from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Share } from 'react-native';
import { Text, Surface, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';
import { groupService } from '../services/group.service';
import { formatCurrencyFromCents, type ActivityDto, type ExpenseDto, type GroupDto, type GroupMemberSummaryDto, type GroupSummaryDto } from '@fairshare/shared-types';
import { ActivityItem } from '../components/ActivityItem';
import { ExpenseCard } from '../components/ExpenseCard';
import { SectionHeader } from '../components/SectionHeader';
import { useToastStore } from '../store/toastStore';

export function GuestGroupDetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const { token } = route.params;
  const { colors, typography, shadows } = useAppTheme();
  const toast = useToastStore((state) => state.show);

  const [group, setGroup] = React.useState<GroupDto | null>(null);
  const [summary, setSummary] = React.useState<GroupSummaryDto | null>(null);
  const [expenses, setExpenses] = React.useState<ExpenseDto[]>([]);
  const [members, setMembers] = React.useState<GroupMemberSummaryDto[]>([]);
  const [activities, setActivities] = React.useState<ActivityDto[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadData = React.useCallback(async () => {
    try {
      const [groupData, summaryData, expensesData, membersData, activityData] = await Promise.all([
        groupService.getGuest(token),
        groupService.guestSummary(token),
        groupService.guestExpenses(token),
        groupService.guestMembers(token),
        groupService.guestActivity(token, 0, 10),
      ]);

      setGroup(groupData);
      setSummary(summaryData);
      setExpenses(expensesData.items);
      setMembers(membersData);
      setActivities(activityData.items);
    } catch (err) {
      console.error(err);
      toast('Failed to load shared group');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [token, toast, navigation]);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  if (loading || !group) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <MaterialCommunityIcons name="loading" size={32} color={colors.primary} />
        <Text style={[typography.bodyMedium, { color: colors.text_secondary, marginTop: 10 }]}>Loading share link...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Guest Badge */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.guestBadgeContainer}>
          <Surface style={[styles.guestBadge, { backgroundColor: `${colors.primary}15`, borderColor: `${colors.primary}30` }]}>
            <MaterialCommunityIcons name="eye-outline" size={14} color={colors.primary} />
            <Text style={[styles.guestBadgeText, { color: colors.primary }]}>VIEW ONLY MODE</Text>
          </Surface>
        </Animated.View>

        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
          <Text style={[typography.h1, { color: colors.text_primary }]}>{group.name}</Text>
          <Text style={[typography.bodyMedium, { color: colors.text_secondary }]}>
            Shared with you via public link
          </Text>
        </Animated.View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Surface style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }, shadows.soft]}>
            <Text style={[styles.statLabel, { color: colors.text_secondary }]}>TOTAL SPEND</Text>
            <Text style={[styles.statValue, { color: colors.text_primary }]}>
              {formatCurrencyFromCents(summary?.totalExpensesCents ?? 0, group.currency)}
            </Text>
          </Surface>
          <Surface style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }, shadows.soft]}>
            <Text style={[styles.statLabel, { color: colors.text_secondary }]}>MEMBERS</Text>
            <Text style={[styles.statValue, { color: colors.text_primary }]}>{members.length}</Text>
          </Surface>
        </View>

        {/* Join Prompt */}
        <Animated.View entering={FadeInDown.delay(200)}>
          <Surface style={[styles.promptCard, { backgroundColor: `${colors.accent}08`, borderColor: `${colors.accent}20` }]}>
            <View style={styles.promptIconBg}>
              <MaterialCommunityIcons name="account-plus-outline" size={24} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.promptTitle, { color: colors.text_primary }]}>Want to join in?</Text>
              <Text style={[styles.promptDesc, { color: colors.text_secondary }]}>
                Sign up to start splitting expenses and tracking balances.
              </Text>
              <TouchableOpacity 
                style={[styles.promptButton, { backgroundColor: colors.accent }]}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.promptButtonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </Surface>
        </Animated.View>

        {/* Expenses */}
        <SectionHeader title="Recent Expenses" />
        <View style={styles.listContainer}>
          {expenses.map((expense, i) => {
            const payer = members.find((m) => m.userId === expense.payerId);
            return (
              <Animated.View key={expense.id} entering={FadeInDown.delay(300 + i * 50)}>
                <ExpenseCard
                  description={expense.description}
                  amount={formatCurrencyFromCents(expense.totalAmountCents, expense.currency)}
                  payerName={payer?.name ?? 'Unknown'}
                  payerInitials={(payer?.name ?? 'U').charAt(0)}
                  participantCount={expense.splits?.length ?? 0}
                  date={new Date(expense.createdAt).toLocaleDateString()}
                  onPress={() => {}} // Disabled for guests
                />
              </Animated.View>
            );
          })}
          {expenses.length === 0 && (
            <Text style={styles.emptyText}>No expenses yet</Text>
          )}
        </View>

        {/* Activity */}
        <SectionHeader title="Activity History" />
        <View style={styles.listContainer}>
          {activities.map((activity, i) => (
            <Animated.View key={activity.id} entering={FadeInDown.delay(500 + i * 50)}>
                <ActivityItem
                  title={activity.type.replace(/_/g, ' ')}
                  subtitle={`Recorded by ${activity.actorName ?? 'a member'}${activity.groupName ? ` in ${activity.groupName}` : ''}`}
                  date={new Date(activity.createdAt).toLocaleDateString()}
                  icon="history"
                />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: 60,
  },
  guestBadgeContainer: {
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  guestBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  header: {
    marginBottom: spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  promptCard: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderRadius: 24,
    borderWidth: 1,
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  promptIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  promptDesc: {
    fontSize: 13,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  promptButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  promptButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  listContainer: {
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.5,
    padding: spacing.xl,
  },
});
