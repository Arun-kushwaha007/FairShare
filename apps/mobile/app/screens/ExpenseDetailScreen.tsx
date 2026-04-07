import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Text, TextInput } from 'react-native-paper';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { EXPENSE_CATEGORIES, formatCurrencyFromCents, type ExpenseCategory, type ExpenseDto } from '@fairshare/shared-types';
import { expenseService } from '../services/expense.service';
import { SkeletonList } from '../components/ui/SkeletonList';
import { useToastStore } from '../store/toastStore';
import { Button } from '../components/ui/Button';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';
import { Card } from '../components/ui/Card';

const categoryLabels: Record<ExpenseCategory, string> = {
  FOOD: 'Food',
  TRAVEL: 'Travel',
  UTILITIES: 'Utilities',
  GROCERIES: 'Groceries',
  ENTERTAINMENT: 'Entertainment',
  OTHER: 'Other',
};

function getReceiptUrl(fileKey?: string | null): string | null {
  const base = process.env.EXPO_PUBLIC_S3_BASE_URL ?? '';
  if (!base || !fileKey) {
    return null;
  }

  return `${base.replace(/\/$/, '')}/${fileKey}`;
}

/**
 * Infers a file extension for an image asset from its filename or MIME type.
 *
 * @param asset - The ImagePicker asset to inspect (may include `fileName` and `mimeType`)
 * @returns The inferred file extension in lowercase (e.g., `png`, `heic`, `jpg`), or `undefined` if no information is available
 */
function inferExtension(asset: ImagePicker.ImagePickerAsset): string | undefined {
  const fileName = asset.fileName ?? '';
  const fileExtension = fileName.includes('.') ? fileName.split('.').pop() : undefined;
  if (fileExtension) {
    return fileExtension.toLowerCase();
  }

  const mimeType = asset.mimeType ?? '';
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/heic') return 'heic';
  return 'jpg';
}

/**
 * Render the expense detail screen allowing viewing, editing, and receipt upload for a single expense.
 *
 * Fetches and displays an expense by `route.params.expenseId`, provides inline editing of description and category,
 * and supports attaching or replacing a receipt image with size and permission checks.
 *
 * @param route - Navigation route object whose `params.expenseId` is the ID of the expense to display
 * @returns A React element that renders the expense detail screen
 */
export function ExpenseDetailScreen({ route }: { route: { params: { expenseId: string } } }) {
  const [loading, setLoading] = React.useState(true);
  const [expense, setExpense] = React.useState<ExpenseDto | null>(null);
  const [receiptUrl, setReceiptUrl] = React.useState<string | null>(null);
  const [receiptLoading, setReceiptLoading] = React.useState(false);
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState<ExpenseCategory | ''>('');
  const [savingEdit, setSavingEdit] = React.useState(false);
  const toast = useToastStore((state) => state.show);
  const { colors, typography } = useAppTheme();

  const loadExpense = React.useCallback(async () => {
    try {
      const nextExpense = await expenseService.get(route.params.expenseId);
      setExpense(nextExpense);
      setDescription(nextExpense.description);
      setCategory((nextExpense.category as ExpenseCategory | null) ?? '');
      setReceiptUrl(getReceiptUrl(nextExpense.receiptFileKey));
    } catch {
      toast('Failed to load expense');
    } finally {
      setLoading(false);
    }
  }, [route.params.expenseId, toast]);

  React.useEffect(() => {
    void loadExpense();
  }, [loadExpense]);

  const saveEdit = async () => {
    if (!expense) return;
    if (description.trim().length < 2) {
      toast('Description must be at least 2 characters');
      return;
    }

    try {
      setSavingEdit(true);
      const updated = await expenseService.update(expense.id, {
        description: description.trim(),
        category: category || null,
      });
      setExpense(updated);
      setEditing(false);
      toast('Expense updated');
    } catch {
      toast('Failed to update expense');
    } finally {
      setSavingEdit(false);
    }
  };

  const uploadReceipt = async () => {
    try {
      setReceiptLoading(true);

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        toast('Allow photo access to attach a receipt');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: false,
      });

      if (result.canceled || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
        toast('Choose an image smaller than 5MB');
        return;
      }

      const extension = inferExtension(asset);
      const presign = await expenseService.createReceiptUploadUrl(route.params.expenseId, extension);
      const uploadBody = await fetch(asset.uri).then((response) => response.blob());
      const uploadResponse = await fetch(presign.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': asset.mimeType ?? 'image/jpeg',
        },
        body: uploadBody,
      });

      if (!uploadResponse.ok) {
        throw new Error('Receipt upload failed');
      }

      setReceiptUrl(getReceiptUrl(presign.fileKey));
      toast('Receipt uploaded');
      await loadExpense();
    } catch {
      toast('Failed to upload receipt');
    } finally {
      setReceiptLoading(false);
    }
  };

  if (loading) {
    return <SkeletonList rows={4} />;
  }

  if (!expense) {
    return null;
  }

  const amount = formatCurrencyFromCents(expense.totalAmountCents, expense.currency);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <Card variant="elevated" style={styles.headerCard}>
        <View style={styles.headerTopRow}>
          <View style={{ flex: 1, gap: spacing.sm }}>
            <Text style={[typography.h2, { color: colors.text_primary }]}>{expense.description}</Text>
            <Text style={[styles.amount, { color: colors.primary }]}>{amount}</Text>
          </View>
          <Button variant="secondary" onPress={() => setEditing((value) => !value)} style={styles.editButton}>
            {editing ? 'Close Edit' : 'Edit'}
          </Button>
        </View>
        <View style={styles.metaRow}>
          <Text style={[typography.bodyMedium, { color: colors.text_secondary }]}>Expense ID {expense.id.slice(0, 8)}</Text>
          <Text style={[typography.bodyMedium, { color: colors.text_secondary }]}>
            {new Date(expense.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {expense.category ? (
          <Text style={[typography.bodyMedium, { color: colors.text_secondary }]}>Category: {categoryLabels[expense.category]}</Text>
        ) : null}
      </Card>

      {editing ? (
        <Card style={styles.editCard}>
          <Text style={[typography.h3, { color: colors.text_primary }]}>Edit expense</Text>
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            outlineStyle={{ borderRadius: 16 }}
            style={styles.input}
          />
          <View style={styles.categoryWrap}>
            {EXPENSE_CATEGORIES.map((value) => {
              const selected = category === value;
              return (
                <TouchableOpacity
                  key={value}
                  onPress={() => setCategory((current) => (current === value ? '' : value))}
                  activeOpacity={0.8}
                >
                  <Card
                    variant={selected ? 'elevated' : 'default'}
                    style={[styles.categoryChip, selected && { borderColor: colors.primary, borderWidth: 1.5 }]}
                  >
                    <Text style={{ color: selected ? colors.primary : colors.text_primary, fontWeight: '700' }}>
                      {categoryLabels[value]}
                    </Text>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.editActions}>
            <Button
              variant="secondary"
              onPress={() => {
                setDescription(expense.description);
                setCategory((expense.category as ExpenseCategory | null) ?? '');
                setEditing(false);
              }}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
            <Button variant="primary" onPress={() => void saveEdit()} loading={savingEdit} style={{ flex: 1 }}>
              Save
            </Button>
          </View>
        </Card>
      ) : null}

      <Card style={styles.receiptCard}>
        <View style={styles.receiptHeader}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[typography.h3, { color: colors.text_primary }]}>Receipt</Text>
            <Text style={[typography.bodyMedium, { color: colors.text_secondary }]}> {receiptUrl ? 'Preview the attached receipt or replace it with a new photo.' : 'Attach a receipt photo for proof and tracking.'}
            </Text>
          </View>
          <Button variant="secondary" onPress={() => void uploadReceipt()} loading={receiptLoading}>
            {receiptUrl ? 'Replace Receipt' : 'Upload Receipt'}
          </Button>
        </View>

        {receiptLoading ? <ActivityIndicator style={{ marginTop: spacing.lg }} /> : null}

        {receiptUrl ? (
          <Pressable onPress={() => setViewerOpen(true)} style={styles.previewPressable}>
            <Image source={{ uri: receiptUrl }} style={styles.previewImage} contentFit="cover" />
          </Pressable>
        ) : (
          <View style={[styles.emptyState, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <Text style={[typography.bodyMedium, { color: colors.text_secondary }]}>No receipt attached yet.</Text>
          </View>
        )}
      </Card>

      <Modal visible={viewerOpen} animationType="fade" onRequestClose={() => setViewerOpen(false)}>
        <View style={styles.viewerShell}>
          <Pressable onPress={() => setViewerOpen(false)} style={styles.viewerClose}>
            <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Close</Text>
          </Pressable>
          {receiptUrl ? <Image source={{ uri: receiptUrl }} style={{ flex: 1 }} contentFit="contain" /> : null}
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  headerCard: {
    padding: spacing.xl,
    gap: spacing.sm,
  },
  headerTopRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  editButton: {
    minWidth: 112,
  },
  amount: {
    fontSize: 28,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  editCard: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  input: {
    backgroundColor: 'transparent',
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  editActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  receiptCard: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  receiptHeader: {
    gap: spacing.md,
  },
  previewPressable: {
    marginTop: spacing.sm,
  },
  previewImage: {
    width: '100%',
    height: 260,
    borderRadius: 20,
  },
  emptyState: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 20,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewerShell: {
    flex: 1,
    backgroundColor: '#000000',
  },
  viewerClose: {
    padding: spacing.lg,
  },
});
