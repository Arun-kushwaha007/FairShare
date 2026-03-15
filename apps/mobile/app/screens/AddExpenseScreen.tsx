import React from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInRight, FadeOutLeft, FadeInLeft, FadeOutRight, FadeInDown } from 'react-native-reanimated';
import type { GroupMemberSummaryDto } from '@fairshare/shared-types';
import { expenseService } from '../services/expense.service';
import { groupService } from '../services/group.service';
import { useToastStore } from '../store/toastStore';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';
import { SplitSelector } from '../components/ui/SplitSelector';
import { SplitType, equalShares, exactShares, percentageShares, sumShares, toCents } from '../utils/split';
import { Button } from '../components/ui/Button';

type FormData = {
  description: string;
  amountCents: string;
};

const STEPS = [
  { title: 'Details', subtitle: 'What was the expense?' },
  { title: 'Payer', subtitle: 'Who paid?' },
  { title: 'Participants', subtitle: 'Who was involved?' },
  { title: 'Split', subtitle: 'How to split?' },
  { title: 'Review', subtitle: 'Confirm and create' },
];

export function AddExpenseScreen({
  route,
  navigation,
}: {
  route: { params: { groupId: string } };
  navigation: { goBack: () => void };
}) {
  const { control, handleSubmit, watch } = useForm<FormData>({
    defaultValues: { description: '', amountCents: '0' },
  });
  const [members, setMembers] = React.useState<GroupMemberSummaryDto[]>([]);
  const [payerId, setPayerId] = React.useState<string>('');
  const [splitType, setSplitType] = React.useState<SplitType>('equal');
  const [selectedParticipantIds, setSelectedParticipantIds] = React.useState<string[]>([]);
  const [exactByUser, setExactByUser] = React.useState<Record<string, string>>({});
  const [percentagesByUser, setPercentagesByUser] = React.useState<Record<string, string>>({});
  const [inlineError, setInlineError] = React.useState<string>('');
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [direction, setDirection] = React.useState<'forward' | 'backward'>('forward');
  const toast = useToastStore((state) => state.show);
  const { colors, isDark } = useAppTheme();

  const watchedDescription = watch('description');
  const watchedAmount = watch('amountCents');

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

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const buildShares = (totalAmount: number): Record<string, number> => {
    if (splitType === 'equal') {
      return equalShares(totalAmount, selectedParticipantIds);
    }
    if (splitType === 'exact') {
      return exactShares(selectedParticipantIds, exactByUser);
    }
    return percentageShares(totalAmount, selectedParticipantIds, percentagesByUser);
  };

  const goNext = () => {
    setInlineError('');
    if (currentStep === 0) {
      if (!watchedDescription.trim()) {
        setInlineError('Enter a description');
        return;
      }
      if (toCents(watchedAmount) <= 0) {
        setInlineError('Amount must be greater than zero');
        return;
      }
    }
    if (currentStep === 1 && !payerId) {
      setInlineError('Select a payer');
      return;
    }
    if (currentStep === 2 && selectedParticipantIds.length === 0) {
      setInlineError('Select at least one participant');
      return;
    }
    setDirection('forward');
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setInlineError('');
    setDirection('backward');
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit = handleSubmit(async (values) => {
    setInlineError('');

    const totalAmount = toCents(values.amountCents);
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

  const enterAnim = direction === 'forward' ? FadeInRight.duration(300) : FadeInLeft.duration(300);
  const exitAnim = direction === 'forward' ? FadeOutLeft.duration(200) : FadeOutRight.duration(200);

  const payerMember = members.find((m) => m.userId === payerId);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Animated.View key="step0" entering={enterAnim} exiting={exitAnim} style={styles.stepContent}>
            <Controller
              control={control}
              name="description"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  label="Description"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  outlineStyle={{ borderRadius: 12 }}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  textColor={colors.text_primary}
                  style={styles.input}
                />
              )}
            />
            <Controller
              control={control}
              name="amountCents"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  label="Amount"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  mode="outlined"
                  outlineStyle={{ borderRadius: 12 }}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  textColor={colors.text_primary}
                  style={styles.input}
                />
              )}
            />
          </Animated.View>
        );

      case 1:
        return (
          <Animated.View key="step1" entering={enterAnim} exiting={exitAnim} style={styles.stepContent}>
            {members.map((member) => (
              <TouchableOpacity
                key={member.memberId}
                style={[
                  styles.memberOption,
                  {
                    backgroundColor: payerId === member.userId ? `${colors.primary}10` : colors.surface,
                    borderColor: payerId === member.userId ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setPayerId(member.userId)}
                activeOpacity={0.8}
              >
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.avatarText}>{getInitials(member.name)}</Text>
                </View>
                <Text style={[styles.memberName, { color: colors.text_primary }]}>
                  {member.name}
                </Text>
                {payerId === member.userId && (
                  <MaterialCommunityIcons name="check-circle" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View key="step2" entering={enterAnim} exiting={exitAnim} style={styles.stepContent}>
            {members.map((member) => {
              const selected = selectedParticipantIds.includes(member.userId);
              return (
                <TouchableOpacity
                  key={member.memberId}
                  style={[
                    styles.memberOption,
                    {
                      backgroundColor: selected ? `${colors.primary}10` : colors.surface,
                      borderColor: selected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => {
                    setSelectedParticipantIds((prev) =>
                      selected
                        ? prev.filter((id) => id !== member.userId)
                        : [...prev, member.userId],
                    );
                  }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.avatar, { backgroundColor: selected ? colors.primary : colors.muted }]}>
                    <Text style={styles.avatarText}>{getInitials(member.name)}</Text>
                  </View>
                  <Text style={[styles.memberName, { color: colors.text_primary }]}>
                    {member.name}
                  </Text>
                  {selected && (
                    <MaterialCommunityIcons name="check-circle" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View key="step3" entering={enterAnim} exiting={exitAnim} style={styles.stepContent}>
            <SplitSelector
              members={members}
              splitType={splitType}
              selectedParticipantIds={selectedParticipantIds}
              exactByUser={exactByUser}
              percentagesByUser={percentagesByUser}
              onSplitTypeChange={setSplitType}
              onParticipantsChange={setSelectedParticipantIds}
              onExactChange={(userId, value) =>
                setExactByUser((state) => ({ ...state, [userId]: value }))
              }
              onPercentageChange={(userId, value) =>
                setPercentagesByUser((state) => ({ ...state, [userId]: value }))
              }
            />
          </Animated.View>
        );

      case 4: {
        const totalAmount = toCents(watchedAmount);
        const shares = totalAmount > 0 ? buildShares(totalAmount) : {};
        return (
          <Animated.View key="step4" entering={enterAnim} exiting={exitAnim} style={styles.stepContent}>
             <View style={[styles.reviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.reviewItem}>
                  <Text style={[styles.reviewLabel, { color: colors.text_secondary }]}>Description</Text>
                  <Text style={[styles.reviewValue, { color: colors.text_primary }]}>{watchedDescription}</Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={[styles.reviewLabel, { color: colors.text_secondary }]}>Amount</Text>
                  <Text style={[styles.reviewValue, { color: colors.text_primary, fontSize: 24 }]}>${(totalAmount / 100).toFixed(2)}</Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={[styles.reviewLabel, { color: colors.text_secondary }]}>Paid by</Text>
                  <Text style={[styles.reviewValue, { color: colors.text_primary }]}>{payerMember?.name ?? 'Unknown'}</Text>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <Text style={[styles.reviewLabel, { color: colors.text_secondary, marginBottom: spacing.sm }]}>Splits ({splitType})</Text>
                {selectedParticipantIds.map((userId) => {
                  const member = members.find((m) => m.userId === userId);
                  const shareAmount = shares[userId] ?? 0;
                  return (
                    <View key={userId} style={styles.splitRow}>
                      <Text style={[styles.splitUser, { color: colors.text_primary }]}>{member?.name ?? 'Unknown'}</Text>
                      <Text style={[styles.splitAmount, { color: colors.primary }]}>${(shareAmount / 100).toFixed(2)}</Text>
                    </View>
                  );
                })}
             </View>
          </Animated.View>
        );
      }
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Progress Dots */}
      <View style={styles.progressRow}>
        {STEPS.map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.progressDot, 
              { backgroundColor: i <= currentStep ? colors.primary : colors.border }
            ]} 
          />
        ))}
      </View>

      <View style={styles.stepHeader}>
        <Text style={[styles.stepTitle, { color: colors.text_primary }]}>{STEPS[currentStep].title}</Text>
        <Text style={[styles.stepSubtitle, { color: colors.text_secondary }]}>{STEPS[currentStep].subtitle}</Text>
      </View>

      <View style={{ flex: 1 }}>
        {renderStep()}
      </View>

      {inlineError ? (
        <Animated.View entering={FadeInDown} style={[styles.errorBox, { backgroundColor: `${colors.danger}10`, borderColor: colors.danger }]}>
          <MaterialCommunityIcons name="alert-circle-outline" size={20} color={colors.danger} />
          <Text style={[styles.errorText, { color: colors.danger }]}>{inlineError}</Text>
        </Animated.View>
      ) : null}

      <View style={styles.footer}>
        <Button 
          variant="secondary" 
          onPress={currentStep === 0 ? () => navigation.goBack() : goBack}
          style={{ flex: 1 }}
        >
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        <Button 
          variant="primary" 
          onPress={currentStep === STEPS.length - 1 ? onSubmit : goNext}
          style={{ flex: 2 }}
        >
          {currentStep === STEPS.length - 1 ? 'Confirm & Create' : 'Next'}
        </Button>
      </View>

      <Modal visible={successOpen} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.successBox, { backgroundColor: colors.surface }]}>
            <LottieView
              source={require('../assets/animations/expense-success.json')}
              autoPlay
              loop={false}
              style={{ width: 160, height: 160 }}
            />
            <Text style={[styles.successTitle, { color: colors.text_primary }]}>Success!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepHeader: {
    marginBottom: spacing.xl,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  stepSubtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  stepContent: {
    gap: spacing.lg,
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  memberOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.md,
    // Soft shadow
    shadowColor: 'rgba(0,0,0,0.03)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  memberName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  reviewCard: {
    padding: spacing.xl,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  reviewItem: {
    marginBottom: spacing.lg,
  },
  reviewLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  reviewValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: spacing.lg,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  splitUser: {
    fontSize: 14,
    fontWeight: '500',
  },
  splitAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.lg,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successBox: {
    padding: spacing.xxl,
    borderRadius: 32,
    alignItems: 'center',
    gap: spacing.md,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
});
