import React from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { FAB, Button, Text } from 'react-native-paper';
import type { ExpenseDto, GroupMemberSummaryDto } from '@fairshare/shared-types';
import { groupService } from '../services/group.service';
import { expenseService } from '../services/expense.service';
import { realtimeService } from '../services/realtime.service';
import { useExpenseStore } from '../store/expenseStore';
import { useToastStore } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/SkeletonList';
import { Avatar } from '../components/ui/Avatar';
import { spacing } from '../theme/spacing';

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
  const expenses = useExpenseStore((state) => state.expensesByGroup[route.params.groupId] ?? []);
  const setExpenses = useExpenseStore((state) => state.setExpenses);
  const toast = useToastStore((state) => state.show);
  const currentUserId = useAuthStore((state) => state.user?.id);

  const load = React.useCallback(async () => {
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

  const showMemberSummary = (member: GroupMemberSummaryDto) => {
    if (!currentUserId) {
      return;
    }

    const pairBalance = balances.find(
      (balance) => balance.userId === currentUserId && balance.counterpartyUserId === member.userId,
    );

    const amount = pairBalance ? Number(pairBalance.amountCents) / 100 : 0;
    if (amount === 0) {
      toast(`${member.name}: settled`);
      return;
    }

    if (amount > 0) {
      toast(`${member.name} owes you $${amount.toFixed(2)}`);
      return;
    }

    toast(`You owe ${member.name} $${Math.abs(amount).toFixed(2)}`);
  };

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

  const renderExpenseRow = (expense: ExpenseDto) => {
    const payer = memberById.get(expense.payerId);
    const participantCount = expense.splits?.length ?? 0;

    return (
      <Swipeable
        key={expense.id}
        renderRightActions={() => (
          <Button mode="contained" buttonColor="#b91c1c" onPress={() => setDeleteTarget(expense)}>
            Delete
          </Button>
        )}
      >
        <Button onPress={() => navigation.navigate('ExpenseDetail', { expenseId: expense.id })}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, width: '100%' }}>
            <Avatar name={payer?.name ?? 'U'} avatarUrl={payer?.avatarUrl} />
            <View style={{ flex: 1 }}>
              <Text>{expense.description}</Text>
              <Text>
                {payer?.name ?? expense.payerId} â€¢ {participantCount} participants â€¢{' '}
                {new Date(expense.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Text>${(Number(expense.totalAmountCents) / 100).toFixed(2)}</Text>
          </View>
        </Button>
      </Swipeable>
    );
  };

  const deleteExpense = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      await expenseService.remove(deleteTarget.id);
      toast('Expense deleted');
      setDeleteTarget(null);
      await load();
    } catch {
      toast('Failed to delete expense');
    }
  };

  if (loading) {
    return <SkeletonList rows={5} />;
  }

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl }}>
        <Text variant="headlineSmall" style={{ marginBottom: spacing.sm }}>
          Group Detail
        </Text>
        {summary ? (
          <View style={{ padding: spacing.sm, borderRadius: 10, backgroundColor: '#EEF2FF', marginBottom: spacing.md }}>
            <Text>Total Spending: ${(Number(summary.totalExpensesCents) / 100).toFixed(2)}</Text>
            <Text>Top Spender: {summary.topSpenderUserId ?? 'N/A'}</Text>
            <Text>
              Your Balance: $
              {currentUserId ? (Number(summary.perUserOwedCents[currentUserId] ?? '0') / 100).toFixed(2) : '0.00'}
            </Text>
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
          {members.slice(0, 6).map((member) => (
            <Button key={member.memberId} compact onPress={() => showMemberSummary(member)}>
              <Avatar name={member.name} avatarUrl={member.avatarUrl} />
            </Button>
          ))}
        </View>

        <Button mode="outlined" onPress={() => navigation.navigate('GroupMembers', { groupId: route.params.groupId })}>
          View Members
        </Button>

        <Button mode="contained" style={{ marginTop: spacing.sm }} onPress={() => navigation.navigate('AddExpense', { groupId: route.params.groupId })}>
          Add Expense
        </Button>
        <Button style={{ marginTop: spacing.sm }} onPress={() => navigation.navigate('SettleUp', { groupId: route.params.groupId })}>
          Settle Up
        </Button>

        <Text variant="titleMedium" style={{ marginTop: spacing.md }}>
          Today
        </Text>
        {groupedExpenses.today.length === 0 ? <EmptyState kind="no_expenses" title="No expenses today" /> : groupedExpenses.today.map(renderExpenseRow)}

        <Text variant="titleMedium" style={{ marginTop: spacing.md }}>
          This Week
        </Text>
        {groupedExpenses.week.length === 0 ? <EmptyState kind="no_expenses" title="No expenses this week" /> : groupedExpenses.week.map(renderExpenseRow)}

        <Text variant="titleMedium" style={{ marginTop: spacing.md }}>
          Older
        </Text>
        {groupedExpenses.older.length === 0 ? <EmptyState kind="no_expenses" title="No older expenses" /> : groupedExpenses.older.map(renderExpenseRow)}
      </ScrollView>

      <FAB
        icon="plus-circle"
        style={{ position: 'absolute', right: spacing.md, bottom: spacing.md }}
        onPress={() => navigation.navigate('AddExpense', { groupId: route.params.groupId })}
      />

      <Modal transparent visible={Boolean(deleteTarget)} onRequestClose={() => setDeleteTarget(null)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            padding: spacing.md,
          }}
        >
          <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: spacing.md, gap: spacing.sm }}>
            <Text variant="titleMedium">Delete Expense?</Text>
            <Text>{deleteTarget?.description}</Text>
            <Button mode="contained" buttonColor="#b91c1c" onPress={() => void deleteExpense()}>
              Confirm Delete
            </Button>
            <Button onPress={() => setDeleteTarget(null)}>Cancel</Button>
          </View>
        </View>
      </Modal>
    </>
  );
}
