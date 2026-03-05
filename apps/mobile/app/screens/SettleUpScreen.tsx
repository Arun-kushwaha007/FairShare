import React from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { settlementService } from '../services/settlement.service';
import { groupService } from '../services/group.service';
import { useToastStore } from '../store/toastStore';

export function SettleUpScreen({ route }: { route: { params: { groupId: string } } }) {
  const [suggestions, setSuggestions] = React.useState<Array<{ fromUserId: string; toUserId: string; amountCents: string }>>([]);
  const [successOpen, setSuccessOpen] = React.useState(false);
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
        {suggestions.map((item, index) => (
          <Button
            key={`${item.fromUserId}-${item.toUserId}-${index}`}
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
                toast('Failed to settle');
              }
            }}
          >
            {item.fromUserId} pays {item.toUserId} ${(Number(item.amountCents) / 100).toFixed(2)}
          </Button>
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