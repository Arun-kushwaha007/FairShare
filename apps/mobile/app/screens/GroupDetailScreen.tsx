import React from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { ExpenseDto, GroupMemberSummaryDto } from '@fairshare/shared-types';
import { groupService } from '../services/group.service';
import { expenseService } from '../services/expense.service';
import { realtimeService } from '../services/realtime.service';
import { useExpenseStore } from '../store/expenseStore';
import { useToastStore } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';
import { BalanceCard } from '../components/BalanceCard';
import { SectionHeader } from '../components/SectionHeader';
import { MemberAvatarStack } from '../components/MemberAvatarStack';
import { ExpenseCard } from '../components/ExpenseCard';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/SkeletonList';
import { endScreenLoad, startScreenLoad } from '../utils/perf';
import { Button } from '../components/ui/Button';

const EMPTY_EXPENSES: ExpenseDto[] = [];

export function GroupDetailScreen({
  route,
  navigation,
}: {
  route: { params: { groupId: string } };
  navigation: { navigate: (route: string, params?: any) => void };
}) {
  const [loading, setLoading] = React.useState(true);
  const [balances, setBalances] = React.useState<Array<{ id: string; amountCents: string; userId: string; counterpartyUserId: string }>>([]);
  const [members, setMembers] = React.useState<GroupMemberSummaryDto[]>([]);
  const [summary, setSummary] = React.useState<{
    totalExpensesCents: string;
    topSpenderUserId: string | null;
    perUserOwedCents: Record<string, string>;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ExpenseDto | null>(null);
  const expenses = useExpenseStore(
    React.useCallback((state) => state.expensesByGroup[route.params.groupId] ?? EMPTY_EXPENSES, [route.params.groupId])
  );
  const setExpenses = useExpenseStore((state) => state.setExpenses);
  const toast = useToastStore((state) => state.show);
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { colors, isDark } = useAppTheme();

  const load = React.useCallback(async () => {
    startScreenLoad('GroupDetail');
    try {
      const [expenseData, balanceData, memberData] = await Promise.all([
        expenseService.list(route.params.groupId),
        groupService.balances(route.params.groupId),
        groupService.members(route.params.groupId),
      ]);
      const summaryData = await groupService.summary(route.params.groupId);
      setExpenses(route.params.groupId, expenseData.items);
      setBalances(balanceData);
      setMembers(memberData);
      setSummary({
        totalExpensesCents: summaryData.totalExpensesCents,
        topSpenderUserId: summaryData.topSpenderUserId,
        perUserOwedCents: summaryData.perUserOwedCents,
      });
    } catch {
      toast('Failed to load group details');
    } finally {
      setLoading(false);
      endScreenLoad('GroupDetail');
    }
  }, [route.params.groupId, setExpenses, toast]);

  React.useEffect(() => {
    void load();
  }, [load]);

  React.useEffect(() => {
    const groupId = route.params.groupId;
    realtimeService.joinGroup(groupId);
    const unsubscribe = realtimeService.subscribeGroupRefresh(groupId);

    return () => {
      unsubscribe();
      realtimeService.leaveGroup(groupId);
    };
  }, [route.params.groupId]);

  const memberById = React.useMemo(() => {
    const map = new Map<string, GroupMemberSummaryDto>();
    members.forEach((member) => map.set(member.userId, member));
    return map;
  }, [members]);

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const userBalance = React.useMemo(() => {
    if (!currentUserId || !summary) return 0;
    return Number(summary.perUserOwedCents[currentUserId] ?? '0') / 100;
  }, [currentUserId, summary]);

  const groupedExpenses = React.useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = startOfToday - 6 * 24 * 60 * 60 * 1000;

    const groups = {
      today: [] as ExpenseDto[],
      week: [] as ExpenseDto[],
      older: [] as ExpenseDto[],
    };

    expenses.forEach((expense) => {
      const ts = new Date(expense.createdAt).getTime();
      if (ts >= startOfToday) {
        groups.today.push(expense);
      } else if (ts >= startOfWeek) {
        groups.week.push(expense);
      } else {
        groups.older.push(expense);
      }
    });

    return groups;
  }, [expenses]);

  const renderExpenseCard = (expense: ExpenseDto) => {
    const payer = memberById.get(expense.payerId);
    const participantCount = expense.splits?.length ?? 0;

    return (
      <Swipeable
        key={expense.id}
        renderRightActions={() => (
          <TouchableOpacity
            style={[styles.deleteAction, { backgroundColor: colors.danger }]}
            onPress={() => setDeleteTarget(expense)}
          >
            <MaterialCommunityIcons name="delete-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      >
        <ExpenseCard
          description={expense.description}
          amount={`$${(Number(expense.totalAmountCents) / 100).toFixed(2)}`}
          payerName={payer?.name ?? 'Unknown'}
          payerInitials={getInitials(payer?.name ?? 'U')}
          participantCount={participantCount}
          date={new Date(expense.createdAt).toLocaleDateString()}
          onPress={() => navigation.navigate('ExpenseDetail', { expenseId: expense.id })}
        />
      </Swipeable>
    );
  };

  if (loading) return <SkeletonList rows={5} />;

  const renderExpenseSection = (title: string, expenses: ExpenseDto[], delay: number) => {
    if (expenses.length === 0) return null;
    return (
      <Animated.View entering={FadeInDown.duration(400).delay(delay)}>
        <SectionHeader title={title} />
        {expenses.map(renderExpenseCard)}
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Summary */}
        {summary && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.balanceSection}>
            <BalanceCard
              title="Total Spent"
              amount={`$${(Number(summary.totalExpensesCents) / 100).toFixed(2)}`}
              icon="cash-multiple"
            />
            <BalanceCard
              title="Your Balance"
              amount={`$${Math.abs(userBalance).toFixed(2)}`}
              subtitle={userBalance > 0 ? 'You are owed' : userBalance < 0 ? 'You owe' : 'Settled up'}
              variant={userBalance > 0 ? 'success' : userBalance < 0 ? 'danger' : 'default'}
              icon={userBalance >= 0 ? 'trending-up' : 'trending-down'}
            />
          </Animated.View>
        )}

        {/* Members */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.membersSection}>
          <SectionHeader
            title="Members"
            action="View All"
            onActionPress={() => navigation.navigate('GroupMembers', { groupId: route.params.groupId })}
          />
          <View style={[styles.membersRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <MemberAvatarStack
              members={members.map((m) => ({ userId: m.userId, name: m.name, avatarUrl: m.avatarUrl }))}
              maxVisible={6}
              size={40}
            />
            <Text style={[styles.memberCount, { color: colors.text_secondary }]}>
              {members.length} members involved
            </Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <Button 
            variant="primary" 
            onPress={() => navigation.navigate('AddExpense', { groupId: route.params.groupId })}
            style={{ flex: 1 }}
          >
            Add Expense
          </Button>
          <Button 
            variant="secondary" 
            onPress={() => navigation.navigate('SettleUp', { groupId: route.params.groupId })}
            style={{ flex: 1 }}
          >
            Settle Up
          </Button>
        </View>

        {/* Expense History */}
        {renderExpenseSection('Today', groupedExpenses.today, 300)}
        {renderExpenseSection('This Week', groupedExpenses.week, 400)}
        {renderExpenseSection('Older', groupedExpenses.older, 500)}

        {expenses.length === 0 && (
          <EmptyState kind="no_expenses" title="No expenses yet" />
        )}
      </ScrollView>

      <FloatingActionButton
        onPress={() => navigation.navigate('AddExpense', { groupId: route.params.groupId })}
      />

      {/* Delete Modal */}
      <Modal transparent visible={Boolean(deleteTarget)} animationType="fade">
        <View style={styles.modalOverlay}>
           <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.danger} />
              <Text style={[styles.modalTitle, { color: colors.text_primary }]}>Delete Expense?</Text>
              <Text style={[styles.modalDesc, { color: colors.text_secondary }]}>This action cannot be undone.</Text>
              <View style={styles.modalActions}>
                  <Button variant="danger" onPress={() => void expenseService.remove(deleteTarget?.id!).then(load)} style={{ flex: 1 }}>Delete</Button>
                  <Button variant="secondary" onPress={() => setDeleteTarget(null)} style={{ flex: 1 }}>Cancel</Button>
              </View>
           </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  balanceSection: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  membersSection: {
    marginBottom: spacing.xl,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
  },
  memberCount: {
    fontSize: 13,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  deleteAction: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginLeft: spacing.md,
    borderRadius: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
});
