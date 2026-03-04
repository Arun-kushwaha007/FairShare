import React from 'react';
import { ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextInput } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { expenseService } from '../services/expense.service';
import { useToastStore } from '../store/toastStore';

type FormData = {
  description: string;
  amountCents: string;
};

export function AddExpenseScreen({ route, navigation }: { route: { params: { groupId: string } }; navigation: { goBack: () => void } }) {
  const { control, handleSubmit } = useForm<FormData>({ defaultValues: { description: '', amountCents: '0' } });
  const toast = useToastStore((state) => state.show);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await expenseService.create(route.params.groupId, {
        payerId: 'me',
        description: values.description,
        totalAmountCents: values.amountCents,
        currency: 'USD',
        splits: [
          { userId: 'me', owedAmountCents: values.amountCents, paidAmountCents: values.amountCents },
        ],
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast('Expense created');
      navigation.goBack();
    } catch {
      toast('Failed to create expense');
    }
  });

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Controller
        control={control}
        name="description"
        render={({ field: { value, onChange } }) => <TextInput label="Description" value={value} onChangeText={onChange} />}
      />
      <Controller
        control={control}
        name="amountCents"
        render={({ field: { value, onChange } }) => <TextInput label="Amount (cents)" value={value} onChangeText={onChange} keyboardType="numeric" />}
      />
      <Button mode="contained" onPress={onSubmit}>Create Expense</Button>
    </ScrollView>
  );
}
