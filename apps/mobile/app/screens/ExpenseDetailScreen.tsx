import React from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
import { Image } from 'expo-image';
import { expenseService } from '../services/expense.service';
import { SkeletonList } from '../components/ui/SkeletonList';
import { useToastStore } from '../store/toastStore';

export function ExpenseDetailScreen({ route }: { route: { params: { expenseId: string } } }) {
  const [loading, setLoading] = React.useState(true);
  const [expense, setExpense] = React.useState<any>(null);
  const [receiptUrl, setReceiptUrl] = React.useState<string | null>(null);
  const [receiptLoading, setReceiptLoading] = React.useState(false);
  const [viewerOpen, setViewerOpen] = React.useState(false);
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
    return <SkeletonList rows={4} />;
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text variant="headlineSmall">{expense.description}</Text>
      <Text>Total: ${(Number(expense.totalAmountCents) / 100).toFixed(2)}</Text>

      <Button
        onPress={async () => {
          try {
            setReceiptLoading(true);
            const res = await expenseService.createReceiptUploadUrl(route.params.expenseId);
            const base = process.env.EXPO_PUBLIC_S3_BASE_URL ?? '';
            const url = base ? `${base.replace(/\/$/, '')}/${res.fileKey}` : null;
            setReceiptUrl(url);
            toast(`Upload URL generated: ${res.fileKey}`);
          } catch {
            toast('Failed to create upload URL');
          } finally {
            setReceiptLoading(false);
          }
        }}
      >
        Generate Receipt Upload URL
      </Button>

      {receiptLoading ? (
        <ActivityIndicator style={{ marginTop: 12 }} />
      ) : null}

      {receiptUrl ? (
        <Pressable onPress={() => setViewerOpen(true)} style={{ marginTop: 16 }}>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>Receipt Preview</Text>
          <Image source={{ uri: receiptUrl }} style={{ width: '100%', height: 220, borderRadius: 12 }} contentFit="cover" />
        </Pressable>
      ) : null}

      <Modal visible={viewerOpen} animationType="fade" onRequestClose={() => setViewerOpen(false)}>
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <Pressable onPress={() => setViewerOpen(false)} style={{ padding: 16 }}>
            <Text style={{ color: '#fff' }}>Close</Text>
          </Pressable>
          {receiptUrl ? <Image source={{ uri: receiptUrl }} style={{ flex: 1 }} contentFit="contain" /> : null}
        </View>
      </Modal>
    </ScrollView>
  );
}
