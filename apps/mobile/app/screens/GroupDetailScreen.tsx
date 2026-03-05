import React from 'react';
import { ScrollView, View } from 'react-native';
import { FAB, Button, Text } from 'react-native-paper';
import type { GroupMemberSummaryDto } from '@fairshare/shared-types';
import { groupService } from '../services/group.service';
import { expenseService } from '../services/expense.service';
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
      setExpenses(route.params.groupId, expenseData.items);
      setBalances(balanceData);
      setMembers(memberData);
    } catch {
      toast('Failed to load group details');
    } finally {
      setLoading(false);
    }
  }, [route.params.groupId, setExpenses, toast]);

  React.useEffect(() => {
    void load();
  }, [load]);

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

  if (loading) {
    return <SkeletonList rows={5} />;
  }

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl }}>
        <Text variant="headlineSmall" style={{ marginBottom: spacing.sm }}>
          Group Detail
        </Text>

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md }}>
          {members.slice(0, 6).map((member) => (
            <Button key={member.memberId} compact onPress={() => showMemberSummary(member)}>
              <Avatar name={member.name} />
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
          Expenses
        </Text>
        {expenses.length === 0 ? (
          <EmptyState title="No expenses yet" />
        ) : (
          expenses.map((expense) => (
            <Button key={expense.id} onPress={() => navigation.navigate('ExpenseDetail', { expenseId: expense.id })}>
              {expense.description} - ${(Number(expense.totalAmountCents) / 100).toFixed(2)}
            </Button>
          ))
        )}

        <Text variant="titleMedium" style={{ marginTop: spacing.md }}>
          Balances
        </Text>
        {balances.length === 0 ? (
          <EmptyState title="No balances yet" />
        ) : (
          balances.map((balance) => (
            <Text key={balance.id}>
              {balance.userId} vs {balance.counterpartyUserId} ${(Number(balance.amountCents) / 100).toFixed(2)}
            </Text>
          ))
        )}
      </ScrollView>
      <FAB
        icon="plus-circle"
        style={{ position: 'absolute', right: spacing.md, bottom: spacing.md }}
        onPress={() => navigation.navigate('AddExpense', { groupId: route.params.groupId })}
      />
    </>
  );
}
