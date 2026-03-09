import React from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInRight, FadeOutLeft, FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import type { GroupMemberSummaryDto } from '@fairshare/shared-types';
import { expenseService } from '../services/expense.service';
import { groupService } from '../services/group.service';
import { useToastStore } from '../store/toastStore';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';
import { SplitSelector } from '../components/ui/SplitSelector';
import { SplitType, equalShares, exactShares, percentageShares, sumShares, toCents } from '../utils/split';

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
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  textColor={colors.text_primary}
                  style={{ backgroundColor: isDark ? colors.card : colors.surface }}
                />
              )}
            />
            <Controller
              control={control}
              name="amountCents"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  label="Amount (cents)"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  mode="outlined"
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  textColor={colors.text_primary}
                  style={{ backgroundColor: isDark ? colors.card : colors.surface }}
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
                    backgroundColor:
                      payerId === member.userId
                        ? `${colors.primary}15`
                        : isDark
                          ? colors.card
                          : colors.surface,
                    borderColor:
                      payerId === member.userId ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setPayerId(member.userId)}
                activeOpacity={0.7}
              >
                <View style={[styles.memberAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.avatarText}>{getInitials(member.name)}</Text>
                </View>
                <Text style={[styles.memberName, { color: colors.text_primary }]}>
                  {member.name}
                </Text>
                {payerId === member.userId && (
                  <MaterialCommunityIcons name="check-circle" size={22} color={colors.primary} />
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
                      backgroundColor: selected
                        ? `${colors.primary}15`
                        : isDark
                          ? colors.card
                          : colors.surface,
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
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.memberAvatar,
                      { backgroundColor: selected ? colors.primary : colors.muted },
                    ]}
                  >
                    <Text style={styles.avatarText}>{getInitials(member.name)}</Text>
                  </View>
                  <Text style={[styles.memberName, { color: colors.text_primary }]}>
                    {member.name}
                  </Text>
                  {selected && (
                    <MaterialCommunityIcons name="check-circle" size={22} color={colors.primary} />
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
            <View
              style={[
                styles.reviewCard,
                {
                  backgroundColor: isDark ? colors.card : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.text_secondary }]}>
                  Description
                </Text>
                <Text style={[styles.reviewValue, { color: colors.text_primary }]}>
                  {watchedDescription}
                </Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.text_secondary }]}>
                  Amount
                </Text>
                <Text style={[styles.reviewValue, { color: colors.text_primary }]}>
                  ${(totalAmount / 100).toFixed(2)}
                </Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.text_secondary }]}>
                  Paid by
                </Text>
                <Text style={[styles.reviewValue, { color: colors.text_primary }]}>
                  {payerMember?.name ?? 'Unknown'}
                </Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.text_secondary }]}>
                  Split
                </Text>
                <Text style={[styles.reviewValue, { color: colors.text_primary }]}>
                  {splitType} • {selectedParticipantIds.length} people
                </Text>
              </View>

              {selectedParticipantIds.map((userId) => {
                const member = members.find((m) => m.userId === userId);
                const shareAmount = shares[userId] ?? 0;
                return (
                  <View key={userId} style={styles.splitRow}>
                    <Text style={{ color: colors.text_primary, fontSize: 14 }}>
                      {member?.name ?? userId}
                    </Text>
                    <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 14 }}>
                      ${(shareAmount / 100).toFixed(2)}
                    </Text>
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
    <>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    i <= currentStep ? colors.primary : `${colors.muted}40`,
                  width: i === currentStep ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Step Header */}
        <View style={styles.stepHeader}>
          <Text style={[styles.stepTitle, { color: colors.text_primary }]}>
            {STEPS[currentStep].title}
          </Text>
          <Text style={[styles.stepSubtitle, { color: colors.text_secondary }]}>
            {STEPS[currentStep].subtitle}
          </Text>
        </View>

        {/* Step Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          showsVerticalScrollIndicator={false}
        >
          {renderStep()}
        </ScrollView>

        {/* Error */}
        {inlineError ? (
          <View style={[styles.errorBanner, { backgroundColor: `${colors.danger}15` }]}>
            <MaterialCommunityIcons name="alert-circle" size={16} color={colors.danger} />
            <Text style={{ color: colors.danger, fontSize: 13, flex: 1 }}>{inlineError}</Text>
          </View>
        ) : null}

        {/* Navigation Footer */}
        <View style={styles.footer}>
          {currentStep > 0 ? (
            <TouchableOpacity
              style={[
                styles.navBtn,
                {
                  backgroundColor: 'transparent',
                  borderWidth: 1.5,
                  borderColor: colors.border,
                },
              ]}
              onPress={goBack}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="arrow-left" size={18} color={colors.text_primary} />
              <Text style={[styles.navBtnText, { color: colors.text_primary }]}>Back</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          {currentStep < STEPS.length - 1 ? (
            <TouchableOpacity
              style={[styles.navBtn, { backgroundColor: colors.primary }]}
              onPress={goNext}
              activeOpacity={0.8}
            >
              <Text style={[styles.navBtnText, { color: '#FFFFFF' }]}>Next</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navBtn, { backgroundColor: colors.success }]}
              onPress={onSubmit}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
              <Text style={[styles.navBtnText, { color: '#FFFFFF' }]}>Create</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Modal visible={successOpen} transparent>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.successModal,
              { backgroundColor: isDark ? colors.card : '#FFFFFF' },
            ]}
          >
            <LottieView
              source={require('../assets/animations/expense-success.json')}
              autoPlay
              loop={false}
              style={{ width: 140, height: 140 }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  progressDot: {
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
    gap: spacing.md,
  },
  memberOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: spacing.md,
  },
  memberAvatar: {
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
    fontSize: 15,
    fontWeight: '600',
  },
  reviewCard: {
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    gap: spacing.md,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewLabel: {
    fontSize: 14,
  },
  reviewValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: 14,
  },
  navBtnText: {
    fontWeight: '700',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  successModal: {
    width: 180,
    height: 180,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});