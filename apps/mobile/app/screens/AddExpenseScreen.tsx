import React from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, Text, TextInput } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import type { GroupMemberSummaryDto } from '@fairshare/shared-types';
import { expenseService } from '../services/expense.service';
import { groupService } from '../services/group.service';
import { useToastStore } from '../store/toastStore';
import { SplitSelector } from '../components/ui/SplitSelector';
import { SplitType, equalShares, exactShares, percentageShares, sumShares, toCents } from '../utils/split';

type FormData = {
  description: string;
  amountCents: string;
};

export function AddExpenseScreen({
  route,
  navigation,
}: {
  route: { params: { groupId: string } };
  navigation: { goBack: () => void };
}) {
  const { control, handleSubmit } = useForm<FormData>({ defaultValues: { description: '', amountCents: '0' } });
  const [members, setMembers] = React.useState<GroupMemberSummaryDto[]>([]);
  const [payerId, setPayerId] = React.useState<string>('');
  const [splitType, setSplitType] = React.useState<SplitType>('equal');
  const [selectedParticipantIds, setSelectedParticipantIds] = React.useState<string[]>([]);
  const [exactByUser, setExactByUser] = React.useState<Record<string, string>>({});
  const [percentagesByUser, setPercentagesByUser] = React.useState<Record<string, string>>({});
  const [inlineError, setInlineError] = React.useState<string>('');
  const [successOpen, setSuccessOpen] = React.useState(false);
  const toast = useToastStore((state) => state.show);

  React.useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await groupService.members(route.params.groupId);
        setMembers(data);
        if (data.length > 0) {
          setPayerId(data[0].userId);
          setSelectedParticipantIds(data.map((member) => member.userId));
        }
      } catch {
        toast('Failed to load members');
      }
    };

    void loadMembers();
  }, [route.params.groupId, toast]);

  const buildShares = (totalAmount: number): Record<string, number> => {
    if (splitType === 'equal') {
      return equalShares(totalAmount, selectedParticipantIds);
    }

    if (splitType === 'exact') {
      return exactShares(selectedParticipantIds, exactByUser);
    }

    return percentageShares(totalAmount, selectedParticipantIds, percentagesByUser);
  };

  const onSubmit = handleSubmit(async (values) => {
    setInlineError('');

    if (!payerId) {
      setInlineError('Select a payer');
      return;
    }

    if (selectedParticipantIds.length === 0) {
      setInlineError('Select at least one participant');
      return;
    }

    const totalAmount = toCents(values.amountCents);
    if (totalAmount <= 0) {
      setInlineError('Total amount must be greater than zero');
      return;
    }

    const shares = buildShares(totalAmount);
    const sharesSum = sumShares(shares);

    if (sharesSum !== totalAmount) {
      setInlineError(`Split mismatch: expected ${totalAmount}, got ${sharesSum}`);
      return;
    }

    try {
      await expenseService.create(route.params.groupId, {
        payerId,
        description: values.description,
        totalAmountCents: String(totalAmount),
        currency: 'USD',
        splits: selectedParticipantIds.map((userId) => ({
          userId,
          owedAmountCents: String(shares[userId] ?? 0),
          paidAmountCents: userId === payerId ? String(totalAmount) : '0',
        })),
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
        toast('Expense created');
        navigation.goBack();
      }, 700);
    } catch {
      toast('Failed to create expense');
    }
  });

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange } }) => <TextInput label="Description" value={value} onChangeText={onChange} />}
        />
        <Controller
          control={control}
          name="amountCents"
          render={({ field: { value, onChange } }) => (
            <TextInput label="Amount (cents)" value={value} onChangeText={onChange} keyboardType="numeric" />
          )}
        />

        <Text variant="titleMedium">Payer</Text>
        {members.map((member) => (
          <Button
            key={member.memberId}
            mode={payerId === member.userId ? 'contained' : 'outlined'}
            onPress={() => setPayerId(member.userId)}
          >
            {member.name}
          </Button>
        ))}

        <SplitSelector
          members={members}
          splitType={splitType}
          selectedParticipantIds={selectedParticipantIds}
          exactByUser={exactByUser}
          percentagesByUser={percentagesByUser}
          onSplitTypeChange={setSplitType}
          onParticipantsChange={setSelectedParticipantIds}
          onExactChange={(userId, value) => setExactByUser((state) => ({ ...state, [userId]: value }))}
          onPercentageChange={(userId, value) => setPercentagesByUser((state) => ({ ...state, [userId]: value }))}
        />

        {inlineError ? <Text style={{ color: '#b91c1c' }}>{inlineError}</Text> : null}

        <Button mode="contained" onPress={onSubmit}>
          Create Expense
        </Button>
      </ScrollView>

      <Modal visible={successOpen} transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <View style={{ width: 180, height: 180, backgroundColor: '#fff', borderRadius: 12 }}>
            <LottieView source={require('../assets/animations/expense-success.json')} autoPlay loop={false} />
          </View>
        </View>
      </Modal>
    </>
  );
}