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
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';

type FormData = {
  description: string;
  amountCents: string;
};

const STEPS = [
  { title: 'Details', subtitle: 'What was the expense?' },
  { title: 'Payer', subtitle: 'Who paid the bill?' },
  { title: 'Participants', subtitle: 'Who is splitting this?' },
  { title: 'Split', subtitle: 'How should we divide it?' },
  { title: 'Review', subtitle: 'Does everything look royal?' },
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
  const { colors, typography, isDark } = useAppTheme();

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
                  outlineStyle={{ borderRadius: 16 }}
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
                  outlineStyle={{ borderRadius: 16 }}
                  style={styles.input}
                  left={<TextInput.Affix text="$" />}
                />
              )}
            />
          </Animated.View>
        );

      case 1:
        return (
          <Animated.View key="step1" entering={enterAnim} exiting={exitAnim} style={styles.stepContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ gap: spacing.sm }}>
                {members.map((member) => (
                  <TouchableOpacity
                    key={member.memberId}
                    onPress={() => setPayerId(member.userId)}
                    activeOpacity={0.8}
                  >
                    <Card
                      variant={payerId === member.userId ? 'elevated' : 'default'}
                      style={[
                        styles.memberCard,
                        payerId === member.userId && { borderColor: colors.primary, borderWidth: 1.5 }
                      ]}
                    >
                      <Avatar name={member.name} size={40} />
                      <Text style={[styles.memberName, { color: colors.text_primary }]}>
                        {member.name}
                      </Text>
                      {payerId === member.userId && (
                        <MaterialCommunityIcons name="check-circle" size={24} color={colors.primary} />
                      )}
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View key="step2" entering={enterAnim} exiting={exitAnim} style={styles.stepContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ gap: spacing.sm }}>
                {members.map((member) => {
                  const selected = selectedParticipantIds.includes(member.userId);
                  return (
                    <TouchableOpacity
                      key={member.memberId}
                      onPress={() => {
                        setSelectedParticipantIds((prev) =>
                          selected
                            ? prev.filter((id) => id !== member.userId)
                            : [...prev, member.userId],
                        );
                      }}
                      activeOpacity={0.8}
                    >
                      <Card
                        variant={selected ? 'elevated' : 'default'}
                        style={[
                          styles.memberCard,
                          selected && { borderColor: colors.primary, borderWidth: 1.5 }
                        ]}
                      >
                        <Avatar name={member.name} size={40} />
                        <Text style={[styles.memberName, { color: colors.text_primary }]}>
                          {member.name}
                        </Text>
                        {selected && (
                          <MaterialCommunityIcons name="check-circle" size={24} color={colors.primary} />
                        )}
                      </Card>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
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
             <Card variant="elevated" style={styles.reviewCard}>
                <View style={styles.reviewItem}>
                  <Text style={[typography.caption, { color: colors.muted }]}>DESCRIPTION</Text>
                  <Text style={[typography.h3, { color: colors.text_primary }]}>{watchedDescription}</Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={[typography.caption, { color: colors.muted }]}>TOTAL AMOUNT</Text>
                  <Text style={[typography.h1, { color: colors.primary }]}>${(totalAmount / 100).toFixed(2)}</Text>
                </View>
                <View style={styles.reviewItem}>
                  <Text style={[typography.caption, { color: colors.muted }]}>PAID BY</Text>
                  <View style={styles.payerRow}>
                    <Avatar name={payerMember?.name ?? 'U'} size={24} />
                    <Text style={[typography.bodyLarge, { color: colors.text_primary, fontWeight: '700' }]}>
                      {payerMember?.name ?? 'Unknown'}
                    </Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <Text style={[typography.caption, { color: colors.muted, marginBottom: spacing.md }]}>SPLITS ({splitType.toUpperCase()})</Text>
                {selectedParticipantIds.map((userId) => {
                  const member = members.find((m) => m.userId === userId);
                  const shareAmount = shares[userId] ?? 0;
                  return (
                    <View key={userId} style={styles.splitRow}>
                      <View style={styles.splitUserCol}>
                        <Avatar name={member?.name ?? 'U'} size={20} />
                        <Text style={[typography.bodyMedium, { color: colors.text_primary, fontWeight: '600' }]}>{member?.name ?? 'Unknown'}</Text>
                      </View>
                      <Text style={[typography.bodyMedium, { color: colors.text_primary, fontWeight: '800' }]}>${(shareAmount / 100).toFixed(2)}</Text>
                    </View>
                  );
                })}
             </Card>
          </Animated.View>
        );
      }
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.progressRow}>
          {STEPS.map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.progressDot, 
                { backgroundColor: i <= currentStep ? colors.primary : colors.border, width: i === currentStep ? 24 : 8 }
              ]} 
            />
          ))}
        </View>

        <View style={styles.stepHeader}>
          <Text style={[typography.h1, { color: colors.text_primary }]}>{STEPS[currentStep].title}</Text>
          <Text style={[typography.bodyMedium, { color: colors.text_secondary }]}>{STEPS[currentStep].subtitle}</Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {renderStep()}
      </View>

      <View style={styles.bottomSection}>
        {inlineError ? (
          <Animated.View entering={FadeInDown} style={[styles.errorBox, { backgroundColor: `${colors.danger}10`, borderColor: colors.danger }]}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color={colors.danger} />
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
      </View>

      <Modal visible={successOpen} transparent animationType="fade">
        <View style={styles.overlay}>
          <Card variant="elevated" style={styles.successCard}>
            <LottieView
              source={require('../assets/animations/expense-success.json')}
              autoPlay
              loop={false}
              style={{ width: 140, height: 140 }}
            />
            <Text style={[typography.h2, { color: colors.text_primary }]}>Royal Success!</Text>
            <Text style={[typography.bodyMedium, { color: colors.text_secondary, textAlign: 'center' }]}>
              The expense has been successfully split.
            </Text>
          </Card>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: spacing.lg,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },
  stepHeader: {
    gap: 4,
  },
  stepContent: {
    flex: 1,
    gap: spacing.lg,
  },
  input: {
    backgroundColor: 'transparent',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  memberName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  reviewCard: {
    padding: spacing.xl,
  },
  reviewItem: {
    marginBottom: spacing.lg,
  },
  payerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginVertical: spacing.xl,
    opacity: 0.5,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  splitUserCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bottomSection: {
    paddingTop: spacing.lg,
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
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  successCard: {
    padding: spacing.xxl,
    alignItems: 'center',
    width: '100%',
    gap: spacing.md,
  },
});
