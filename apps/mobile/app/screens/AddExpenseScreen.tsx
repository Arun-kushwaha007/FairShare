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
import { Button } from '../components/ui/Button';

type FormData = {
  description: string;
  amountCents: string;
};

const STEPS = [
  { title: 'DETAILS', subtitle: 'WHAT WAS THE EXPENSE?' },
  { title: 'PAYER', subtitle: 'WHO PAID?' },
  { title: 'PARTICIPANTS', subtitle: 'WHO WAS INVOLVED?' },
  { title: 'SPLIT', subtitle: 'HOW TO SPLIT?' },
  { title: 'REVIEW', subtitle: 'CONFIRM AND CREATE' },
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
  const { colors } = useAppTheme();

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
        toast('FAILED TO LOAD MEMBERS');
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
        setInlineError('ENTER A DESCRIPTION');
        return;
      }
      if (toCents(watchedAmount) <= 0) {
        setInlineError('AMOUNT MUST BE > 0');
        return;
      }
    }
    if (currentStep === 1 && !payerId) {
      setInlineError('SELECT A PAYER');
      return;
    }
    if (currentStep === 2 && selectedParticipantIds.length === 0) {
      setInlineError('SELECT AT LEAST ONE');
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
      setInlineError(`SPLIT MISMATCH: ${sharesSum}/${totalAmount}`);
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
        toast('EXPENSE CREATED');
        navigation.goBack();
      }, 700);
    } catch {
      toast('FAILED TO CREATE');
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
                  placeholder="DESCRIPTION"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  outlineStyle={{ borderWidth: 3, borderRadius: 0 }}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  textColor={colors.text_primary}
                  style={styles.brutalistInput}
                />
              )}
            />
            <Controller
              control={control}
              name="amountCents"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  placeholder="AMOUNT"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  mode="outlined"
                  outlineStyle={{ borderWidth: 3, borderRadius: 0 }}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  textColor={colors.text_primary}
                  style={styles.brutalistInput}
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
                    backgroundColor: payerId === member.userId ? colors.primary : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setPayerId(member.userId)}
                activeOpacity={0.8}
              >
                <View style={[styles.memberAvatar, { backgroundColor: payerId === member.userId ? colors.background : colors.primary }]}>
                  <Text style={[styles.avatarText, { color: payerId === member.userId ? colors.primary : colors.background }]}>
                    {getInitials(member.name)}
                  </Text>
                </View>
                <Text style={[styles.memberName, { color: payerId === member.userId ? colors.background : colors.text_primary }]}>
                  {member.name.toUpperCase()}
                </Text>
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
                      backgroundColor: selected ? colors.primary : colors.surface,
                      borderColor: colors.border,
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
                  <View style={[styles.memberAvatar, { backgroundColor: selected ? colors.background : colors.muted }]}>
                    <Text style={[styles.avatarText, { color: selected ? colors.primary : colors.background }]}>
                      {getInitials(member.name)}
                    </Text>
                  </View>
                  <Text style={[styles.memberName, { color: selected ? colors.background : colors.text_primary }]}>
                    {member.name.toUpperCase()}
                  </Text>
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
            <View style={styles.reviewWrapper}>
              <View style={styles.reviewShadow} />
              <View style={[styles.reviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>DESC</Text>
                  <Text style={styles.reviewValue}>{watchedDescription.toUpperCase()}</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>TOTAL</Text>
                  <Text style={styles.reviewValue}>${(totalAmount / 100).toFixed(2)}</Text>
                </View>
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewLabel}>PAID BY</Text>
                  <Text style={styles.reviewValue}>{payerMember?.name?.toUpperCase() ?? '??'}</Text>
                </View>
                
                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                {selectedParticipantIds.map((userId) => {
                  const member = members.find((m) => m.userId === userId);
                  const shareAmount = shares[userId] ?? 0;
                  return (
                    <View key={userId} style={styles.splitRow}>
                      <Text style={styles.splitUser}>{member?.name?.toUpperCase() ?? '??'}</Text>
                      <Text style={styles.splitAmount}>${(shareAmount / 100).toFixed(2)}</Text>
                    </View>
                  );
                })}
              </View>
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
      {/* Step Indicator */}
      <View style={styles.progressContainer}>
        {STEPS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressSegment,
              {
                backgroundColor: i <= currentStep ? colors.primary : colors.border,
                borderWidth: 1,
                borderColor: colors.border,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.header}>
        <Text style={[styles.stepTitle, { color: colors.text_primary }]}>{STEPS[currentStep].title}</Text>
        <Text style={[styles.stepSubtitle, { color: colors.text_secondary }]}>{STEPS[currentStep].subtitle}</Text>
      </View>

      <View style={{ flex: 1 }}>
        {renderStep()}
      </View>

      {inlineError ? (
        <View style={styles.errorWrapper}>
          <View style={styles.errorShadow} />
          <View style={[styles.errorBox, { borderColor: colors.danger }]}>
            <Text style={[styles.errorText, { color: colors.danger }]}>{inlineError}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.footer}>
        <Button 
          variant="secondary" 
          onPress={currentStep === 0 ? () => navigation.goBack() : goBack}
          style={{ flex: 1 }}
        >
          {currentStep === 0 ? 'CANCEL' : 'BACK'}
        </Button>
        <Button 
          variant="primary" 
          onPress={currentStep === STEPS.length - 1 ? onSubmit : goNext}
          style={{ flex: 2 }}
        >
          {currentStep === STEPS.length - 1 ? 'CONFIRM' : 'NEXT'}
        </Button>
      </View>

      <Modal visible={successOpen} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={[styles.successBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.successShadow} />
            <View style={styles.successInner}>
               <LottieView
                source={require('../assets/animations/expense-success.json')}
                autoPlay
                loop={false}
                style={{ width: 160, height: 160 }}
              />
              <Text style={styles.successTitle}>DONE</Text>
            </View>
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
  progressContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: spacing.xl,
  },
  progressSegment: {
    flex: 1,
    height: 12,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  stepTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
  },
  stepSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
  },
  stepContent: {
    gap: spacing.lg,
  },
  brutalistInput: {
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  memberOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderWidth: 3,
    gap: spacing.lg,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontWeight: '900',
    fontSize: 18,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  reviewWrapper: {
    position: 'relative',
  },
  reviewShadow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: -8,
    bottom: -8,
    backgroundColor: '#000000',
  },
  reviewCard: {
    padding: spacing.xl,
    borderWidth: 3,
    gap: spacing.lg,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewLabel: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#808080',
  },
  reviewValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  divider: {
    height: 2,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  splitUser: {
    fontSize: 14,
    fontWeight: '800',
  },
  splitAmount: {
    fontSize: 16,
    fontWeight: '900',
  },
  errorWrapper: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  errorShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: '#FF3131',
  },
  errorBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    padding: spacing.md,
    alignItems: 'center',
  },
  errorText: {
    fontWeight: '900',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingTop: spacing.lg,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successBox: {
    width: 240,
    height: 240,
    position: 'relative',
  },
  successShadow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: -12,
    bottom: -12,
    backgroundColor: '#00FF41',
  },
  successInner: {
    flex: 1,
    borderWidth: 4,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 4,
    marginTop: -20,
  },
});
