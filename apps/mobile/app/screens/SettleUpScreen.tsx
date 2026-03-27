import React from 'react';
import { Linking, Modal, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import type { GroupMemberSummaryDto, SimplifySuggestionDto } from '@fairshare/shared-types';
import LottieView from 'lottie-react-native';
import { settlementService } from '../services/settlement.service';
import { groupService } from '../services/group.service';
import { useToastStore } from '../store/toastStore';
import { spacing } from '../theme/spacing';

export function SettleUpScreen({ route }: { route: { params: { groupId: string } } }) {
  const [suggestions, setSuggestions] = React.useState<SimplifySuggestionDto[]>([]);
  const [members, setMembers] = React.useState<GroupMemberSummaryDto[]>([]);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [upiReceiver, setUpiReceiver] = React.useState('');
  const [upiName, setUpiName] = React.useState('FairShare Member');
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [remindingIndex, setRemindingIndex] = React.useState<number | null>(null);
  const toast = useToastStore((state) => state.show);

  React.useEffect(() => {
    const load = async () => {
      try {
        const [nextSuggestions, nextMembers] = await Promise.all([
          groupService.simplify(route.params.groupId),
          groupService.members(route.params.groupId),
        ]);
        setSuggestions(nextSuggestions);
        setMembers(nextMembers);
      } catch {
        toast('Failed to load suggestions');
      }
    };

    void load();
  }, [route.params.groupId, toast]);

  const labelForUser = (userId: string) => members.find((member) => member.userId === userId)?.name ?? userId;

  return (
    <>
      <ScrollView style={{ padding: 16 }} contentContainerStyle={styles.container}>
        <Text variant="headlineSmall">Settle Up</Text>
        <TextInput
          mode="outlined"
          label="Receiver UPI ID"
          value={upiReceiver}
          onChangeText={setUpiReceiver}
          style={{ marginTop: 12 }}
          placeholder="receiver@upi"
        />
        <TextInput
          mode="outlined"
          label="Receiver Name"
          value={upiName}
          onChangeText={setUpiName}
          style={{ marginTop: 12, marginBottom: 12 }}
        />
        {suggestions.map((item, index) => (
          <View key={`${item.fromUserId}-${item.toUserId}-${index}`} style={styles.card}>
            <Text style={styles.title}>
              {labelForUser(item.fromUserId)} pays {labelForUser(item.toUserId)}
            </Text>
            <Text style={styles.amount}>${(Number(item.amountCents) / 100).toFixed(2)}</Text>
            <View style={styles.actionRow}>
              <Button
                mode="outlined"
                style={styles.actionButton}
                loading={remindingIndex === index}
                disabled={remindingIndex === index}
                onPress={async () => {
                  try {
                    setRemindingIndex(index);
                    await groupService.remindSettlement(route.params.groupId, {
                      payerId: item.fromUserId,
                      receiverId: item.toUserId,
                      amountCents: item.amountCents,
                    });
                    toast(`Reminder sent to ${labelForUser(item.fromUserId)}`);
                  } catch {
                    toast('Failed to send reminder');
                  } finally {
                    setRemindingIndex(null);
                  }
                }}
              >
                Remind
              </Button>
              <Button
                mode="outlined"
                style={styles.actionButton}
                onPress={async () => {
                  if (!upiReceiver.trim()) {
                    toast('Enter receiver UPI ID first');
                    return;
                  }
                  const amount = (Number(item.amountCents) / 100).toFixed(2);
                  const upiLink = `upi://pay?pa=${encodeURIComponent(upiReceiver)}&pn=${encodeURIComponent(
                    upiName || 'FairShare Member',
                  )}&am=${encodeURIComponent(amount)}&cu=INR`;
                  const supported = await Linking.canOpenURL(upiLink);
                  if (!supported) {
                    toast('No UPI app found on this device');
                    return;
                  }
                  setSelectedIndex(index);
                  await Linking.openURL(upiLink);
                }}
              >
                Pay via UPI
              </Button>
            </View>
            {selectedIndex === index ? (
              <Button
                mode="contained"
                style={{ marginTop: 8 }}
                onPress={async () => {
                  try {
                    await settlementService.create(route.params.groupId, {
                      payerId: item.fromUserId,
                      receiverId: item.toUserId,
                      amountCents: item.amountCents,
                    });
                    setSuccessOpen(true);
                    setTimeout(() => {
                      setSuccessOpen(false);
                      toast('Settlement recorded');
                    }, 700);
                  } catch {
                    toast('Failed to mark settlement');
                  }
                }}
              >
                Mark as paid
              </Button>
            ) : null}
          </View>
        ))}
      </ScrollView>

      <Modal visible={successOpen} transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <View style={{ width: 180, height: 180, backgroundColor: '#fff', borderRadius: 12 }}>
            <LottieView source={require('../assets/animations/settlement-success.json')} autoPlay loop={false} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
  },
  card: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.24)',
    gap: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  amount: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
