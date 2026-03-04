import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { settlementService } from '../services/settlement.service';
import { groupService } from '../services/group.service';
import { useToastStore } from '../store/toastStore';

export function SettleUpScreen({ route }: { route: { params: { groupId: string } } }) {
  const [suggestions, setSuggestions] = React.useState<Array<{ fromUserId: string; toUserId: string; amountCents: string }>>([]);
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
              toast('Settlement recorded');
            } catch {
              toast('Failed to settle');
            }
          }}
        >
          {item.fromUserId} pays {item.toUserId} ${(Number(item.amountCents) / 100).toFixed(2)}
        </Button>
      ))}
    </ScrollView>
  );
}
