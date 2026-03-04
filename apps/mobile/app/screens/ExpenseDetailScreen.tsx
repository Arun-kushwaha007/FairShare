import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { expenseService } from '../services/expense.service';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToastStore } from '../store/toastStore';

export function ExpenseDetailScreen({ route }: { route: { params: { expenseId: string } } }) {
  const [loading, setLoading] = React.useState(true);
  const [expense, setExpense] = React.useState<any>(null);
  const toast = useToastStore((state) => state.show);

  React.useEffect(() => {
    const load = async () => {
      try {
        setExpense(await expenseService.get(route.params.expenseId));
      } catch {
        toast('Failed to load expense');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [route.params.expenseId, toast]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text variant="headlineSmall">{expense.description}</Text>
      <Text>Total: ${(Number(expense.totalAmountCents) / 100).toFixed(2)}</Text>
      <Button onPress={async () => {
        try {
          const res = await expenseService.createReceiptUploadUrl(route.params.expenseId);
          toast(`Upload URL generated: ${res.fileKey}`);
        } catch {
          toast('Failed to create upload URL');
        }
      }}>Generate Receipt Upload URL</Button>
    </ScrollView>
  );
}
