import React from 'react';
import { Linking, Modal, ScrollView, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { settlementService } from '../services/settlement.service';
import { groupService } from '../services/group.service';
import { useToastStore } from '../store/toastStore';

export function SettleUpScreen({ route }: { route: { params: { groupId: string } } }) {
  const [suggestions, setSuggestions] = React.useState<Array<{ fromUserId: string; toUserId: string; amountCents: string }>>([]);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [upiReceiver, setUpiReceiver] = React.useState('');
  const [upiName, setUpiName] = React.useState('FairShare Member');
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const toast = useToastStore((state) => state.show);

  React.useEffect(() => {
    const load = async () => {
      try {
        setSuggestions(await groupService.simplify(route.params.groupId));
      } catch {
        toast('Failed to load suggestions');
      }
    };

    void load();
  }, [route.params.groupId, toast]);

  return (
    <>
      <ScrollView style={{ padding: 16 }}>
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
          <View key={`${item.fromUserId}-${item.toUserId}-${index}`} style={{ marginBottom: 12 }}>
            <Button
              mode="outlined"
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
              Pay via UPI: {item.fromUserId} to {item.toUserId} ${(Number(item.amountCents) / 100).toFixed(2)}
            </Button>
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
