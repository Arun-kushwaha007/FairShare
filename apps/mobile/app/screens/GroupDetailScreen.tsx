import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { groupService } from '../services/group.service';
import { expenseService } from '../services/expense.service';
import { MoneyText } from '../components/ui/MoneyText';
import { useExpenseStore } from '../store/expenseStore';
import { useToastStore } from '../store/toastStore';

export function GroupDetailScreen({ route, navigation }: { route: { params: { groupId: string } }; navigation: { navigate: (route: string, params?: any) => void } }) {
  const [balances, setBalances] = React.useState<Array<{ id: string; amountCents: string; userId: string; counterpartyUserId: string }>>([]);
  const expenses = useExpenseStore((state) => state.expensesByGroup[route.params.groupId] ?? []);
  const setExpenses = useExpenseStore((state) => state.setExpenses);
  const toast = useToastStore((state) => state.show);

  const load = React.useCallback(async () => {
    try {
      const [expenseData, balanceData] = await Promise.all([
        expenseService.list(route.params.groupId),
        groupService.balances(route.params.groupId),
      ]);
      setExpenses(route.params.groupId, expenseData.items);
      setBalances(balanceData);
    } catch {
      toast('Failed to load group details');
    }
  }, [route.params.groupId, setExpenses, toast]);

  React.useEffect(() => {
    void load();
  }, [load]);

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text variant="headlineSmall" style={{ marginBottom: 12 }}>Group Detail</Text>
      <Button mode="contained" onPress={() => navigation.navigate('AddExpense', { groupId: route.params.groupId })}>Add Expense</Button>
      <Button style={{ marginTop: 8 }} onPress={() => navigation.navigate('SettleUp', { groupId: route.params.groupId })}>Settle Up</Button>

      <Text variant="titleMedium" style={{ marginTop: 16 }}>Expenses</Text>
      {expenses.map((expense) => (
        <Button key={expense.id} onPress={() => navigation.navigate('ExpenseDetail', { expenseId: expense.id })}>
          {expense.description} - ${(Number(expense.totalAmountCents) / 100).toFixed(2)}
        </Button>
      ))}

      <Text variant="titleMedium" style={{ marginTop: 16 }}>Balances</Text>
      {balances.map((balance) => (
        <Text key={balance.id}>
          {balance.userId} vs {balance.counterpartyUserId} <MoneyText cents={balance.amountCents} />
        </Text>
      ))}
    </ScrollView>
  );
}

