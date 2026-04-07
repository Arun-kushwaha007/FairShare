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
import { expenseService } from '../services/expense.service';
import { formatCurrencyFromCents, type ActivityDto, type RecurringExpenseDto, type SimplifySuggestionDto } from '@fairshare/shared-types';
import { ActivityItem } from '../components/ActivityItem';
import { useToastStore } from '../store/toastStore';
import { Image } from 'react-native';

const LOGO_SOURCE = require('../assets/images/logo.png');

type AttentionItem = {
  groupId: string;
  groupName: string;
  settlementCount: number;
  dueRecurringCount: number;
};

const isRecurringDue = (item: RecurringExpenseDto) => new Date(item.nextOccurrenceAt).getTime() <= Date.now();

const amountTextForActivity = (activity: ActivityDto): string | undefined => {
  const raw = activity.metadata?.amountCents ?? activity.metadata?.totalAmountCents;
  if (typeof raw !== 'string') {
    return undefined;
  }
  const currency = activity.metadata?.currency;
  return currency === 'USD' || currency === 'EUR' || currency === 'INR'
    ? formatCurrencyFromCents(raw, currency)
    : formatCurrencyFromCents(raw, 'USD');
};

const iconForActivity = (activity: ActivityDto): keyof typeof MaterialCommunityIcons.glyphMap => {
  switch (activity.type) {
    case 'expense_created':
    case 'expense_updated':
      return 'receipt';
    case 'expense_deleted':
      return 'delete-outline';
    case 'settlement_created':
      return 'handshake-outline';
    case 'settlement_reminder':
      return 'bell-ring-outline';
    case 'member_joined':
    case 'member_invited':
      return 'account-plus-outline';
    default:
      return 'information-outline';
  }
};

const titleForActivity = (activity: ActivityDto): string => {
  switch (activity.type) {
    case 'expense_created':
      return 'Expense added';
    case 'expense_updated':
      return 'Expense updated';
    case 'expense_deleted':
      return 'Expense removed';
    case 'settlement_created':
      return 'Settlement completed';
    case 'settlement_reminder':
      return 'Reminder sent';
    case 'member_joined':
      return 'Member joined';
    case 'member_invited':
      return 'Member invited';
    default:
      return 'Activity update';
  }
};

const subtitleForActivity = (activity: ActivityDto): string => {
  const amount = amountTextForActivity(activity);
  switch (activity.type) {
    case 'settlement_created':
      return amount ? `${amount} cleared` : 'A balance was cleared';
    case 'settlement_reminder':
      return amount ? `${amount} still pending` : 'A pending balance needs follow-up';
    case 'expense_created':
    case 'expense_updated':
      return amount ? `${amount} logged` : 'Ledger updated';
    case 'expense_deleted':
      return 'An expense was removed';
    case 'member_joined':
      return 'A member joined the group';
    case 'member_invited':
      return 'An invite was sent';
    default:
      return `${activity.actorName ?? activity.actorUserId} in ${activity.groupName ?? 'group'}`;
  }
};

export function HomeScreen({ navigation }: { navigation: any }) {
  const user = useAuthStore((state) => state.user);
  const groups = useGroupStore((state) => state.groups);
  const { colors, typography } = useAppTheme();
  const [summary, setSummary] = React.useState<{ totalBalanceCents: string } | null>(null);
  const [activities, setActivities] = React.useState<ActivityDto[]>([]);
  const [attentionItems, setAttentionItems] = React.useState<AttentionItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const toast = useToastStore((state) => state.show);

  const loadData = React.useCallback(async () => {
    try {
      const [summaryData, activityData, nextAttentionItems] = await Promise.all([
        groupService.userSummary(),
        groupService.userActivity(0, 5),
        Promise.all(
          groups.slice(0, 5).map(async (group) => {
            const [suggestions, recurringExpenses] = await Promise.all([
              groupService.simplify(group.id).catch(() => [] as SimplifySuggestionDto[]),
              expenseService.listRecurring(group.id).catch(() => [] as RecurringExpenseDto[]),
            ]);

            return {
              groupId: group.id,
              groupName: group.name,
              settlementCount: suggestions.length,
              dueRecurringCount: recurringExpenses.filter(isRecurringDue).length,
            } satisfies AttentionItem;
          }),
        ),
      ]);
      setSummary(summaryData);
      setActivities(activityData.items);
      setAttentionItems(
        nextAttentionItems
          .filter((item) => item.settlementCount > 0 || item.dueRecurringCount > 0)
          .sort((a, b) => (b.settlementCount + b.dueRecurringCount) - (a.settlementCount + a.dueRecurringCount))
          .slice(0, 4),
      );
    } catch (err) {
      console.error(err);
      toast('Failed to sync your vibes');
    } finally {
      setLoading(false);
    }
  }, [groups, toast]);

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
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <Image
            source={LOGO_SOURCE}
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={[typography.bodyMedium, { color: colors.text_secondary }]}>Yo, welcome back</Text>
            <Text style={[typography.h2, { color: colors.text_primary, marginTop: 2 }]}>{user?.name ?? 'Bestie'}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Avatar name={user?.name ?? 'U'} size={48} />
        </TouchableOpacity>
      </View>

      <Animated.View entering={FadeInDown.duration(400)} style={styles.summarySection}>
        <BalanceCard
          title="The Bag"
          amount={formatCurrencyFromCents(Math.round(Math.abs(totalBalance) * 100), 'USD')}
          subtitle={balanceLabel}
          variant={balanceVariant}
          icon={balanceIcon}
        />
      </Animated.View>

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

      {attentionItems.length > 0 ? (
        <>
          <SectionHeader title="Needs Attention" />
          <View style={styles.attentionList}>
            {attentionItems.map((item, index) => (
              <Animated.View key={item.groupId} entering={FadeInDown.duration(400).delay(250 + index * 80)}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.attentionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() =>
                    item.settlementCount > 0
                      ? navigation.navigate('SettleUp', { groupId: item.groupId })
                      : navigation.navigate('GroupDetail', { groupId: item.groupId })
                  }
                >
                  <View style={styles.attentionHeader}>
                    <View style={styles.attentionTitleRow}>
                      <View style={[styles.attentionIconBg, { backgroundColor: `${colors.warning}12` }]}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={20} color={colors.warning} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.attentionTitle, { color: colors.text_primary }]}>{item.groupName}</Text>
                        <Text style={[styles.attentionSubtitle, { color: colors.text_secondary }]}>Tap to jump to the next task</Text>
                      </View>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={22} color={colors.text_secondary} />
                  </View>
                  <View style={styles.attentionMetaRow}>
                    {item.settlementCount > 0 ? (
                      <View style={[styles.metaPill, { backgroundColor: `${colors.success}12` }]}>
                        <MaterialCommunityIcons name="handshake-outline" size={14} color={colors.success} />
                        <Text style={[styles.metaPillText, { color: colors.success }]}>{item.settlementCount} settlements</Text>
                      </View>
                    ) : null}
                    {item.dueRecurringCount > 0 ? (
                      <View style={[styles.metaPill, { backgroundColor: `${colors.warning}12` }]}>
                        <MaterialCommunityIcons name="calendar-clock-outline" size={14} color={colors.warning} />
                        <Text style={[styles.metaPillText, { color: colors.warning }]}>{item.dueRecurringCount} recurring due</Text>
                      </View>
                    ) : null}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </>
      ) : null}

      <SectionHeader
        title="Recent Activity"
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
                title={titleForActivity(activity)}
                subtitle={subtitleForActivity(activity)}
                amount={amountTextForActivity(activity)}
                date={new Date(activity.createdAt).toLocaleDateString()}
                icon={iconForActivity(activity)}
              />
            </Animated.View>
          ))
        ) : (
          <Text style={[typography.bodyMedium, { color: colors.text_secondary, textAlign: 'center', marginTop: spacing.lg }]}>
            {loading ? 'Syncing dashboard...' : 'No tea to spill yet.'}
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
  attentionList: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  attentionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  attentionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  attentionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  attentionIconBg: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attentionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  attentionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  attentionMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
  },
  metaPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  activityList: {
    gap: spacing.sm,
  },
});
