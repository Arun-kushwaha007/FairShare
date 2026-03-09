import React from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Button, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { ExpenseDto, GroupMemberSummaryDto } from '@fairshare/shared-types';
import { groupService } from '../services/group.service';
import { expenseService } from '../services/expense.service';
import { realtimeService } from '../services/realtime.service';
import { useExpenseStore } from '../store/expenseStore';
import { useToastStore } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';
import { BalanceCard } from '../components/BalanceCard';
import { SectionHeader } from '../components/SectionHeader';
import { MemberAvatarStack } from '../components/MemberAvatarStack';
import { ExpenseCard } from '../components/ExpenseCard';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/SkeletonList';
import { endScreenLoad, startScreenLoad } from '../utils/perf';

export function GroupDetailScreen({
  route,
  navigation,
}: {
  route: { params: { groupId: string } };
  navigation: { navigate: (route: string, params?: any) => void };
}) {
  const [loading, setLoading] = React.useState(true);
  const [balances, setBalances] = React.useState<Array<{ id: string; amountCents: string; userId: string; counterpartyUserId: string }>>([]);
  const [members, setMembers] = React.useState<GroupMemberSummaryDto[]>([]);
  const [summary, setSummary] = React.useState<{
    totalExpensesCents: string;
    topSpenderUserId: string | null;
    perUserOwedCents: Record<string, string>;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ExpenseDto | null>(null);
  const expenses = useExpenseStore((state) => state.expensesByGroup[route.params.groupId] ?? []);
  const setExpenses = useExpenseStore((state) => state.setExpenses);
  const toast = useToastStore((state) => state.show);
  const currentUserId = useAuthStore((state) => state.user?.id);
  const { colors, isDark } = useAppTheme();

  const load = React.useCallback(async () => {
    startScreenLoad('GroupDetail');
    try {
      const [expenseData, balanceData, memberData] = await Promise.all([
        expenseService.list(route.params.groupId),
        groupService.balances(route.params.groupId),
        groupService.members(route.params.groupId),
      ]);
      const summaryData = await groupService.summary(route.params.groupId);
      setExpenses(route.params.groupId, expenseData.items);
      setBalances(balanceData);
      setMembers(memberData);
      setSummary({
        totalExpensesCents: summaryData.totalExpensesCents,
        topSpenderUserId: summaryData.topSpenderUserId,
        perUserOwedCents: summaryData.perUserOwedCents,
      });
    } catch {
      toast('Failed to load group details');
    } finally {
      setLoading(false);
      endScreenLoad('GroupDetail');
    }
  }, [route.params.groupId, setExpenses, toast]);

  React.useEffect(() => {
    void load();
  }, [load]);

  React.useEffect(() => {
    const groupId = route.params.groupId;
    realtimeService.joinGroup(groupId);
    const unsubscribe = realtimeService.subscribeGroupRefresh(groupId);

    return () => {
      unsubscribe();
      realtimeService.leaveGroup(groupId);
    };
  }, [route.params.groupId]);

  const memberById = React.useMemo(() => {
    const map = new Map<string, GroupMemberSummaryDto>();
    members.forEach((member) => map.set(member.userId, member));
    return map;
  }, [members]);

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const userBalance = React.useMemo(() => {
    if (!currentUserId || !summary) return 0;
    return Number(summary.perUserOwedCents[currentUserId] ?? '0') / 100;
  }, [currentUserId, summary]);

  const groupedExpenses = React.useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = startOfToday - 6 * 24 * 60 * 60 * 1000;

    const groups = {
      today: [] as ExpenseDto[],
      week: [] as ExpenseDto[],
      older: [] as ExpenseDto[],
    };

    expenses.forEach((expense) => {
      const ts = new Date(expense.createdAt).getTime();
      if (ts >= startOfToday) {
        groups.today.push(expense);
      } else if (ts >= startOfWeek) {
        groups.week.push(expense);
      } else {
        groups.older.push(expense);
      }
    });

    return groups;
  }, [expenses]);

  const renderExpenseCard = (expense: ExpenseDto) => {
    const payer = memberById.get(expense.payerId);
    const participantCount = expense.splits?.length ?? 0;

    return (
      <Swipeable
        key={expense.id}
        renderRightActions={() => (
          <TouchableOpacity
            style={[styles.deleteAction, { backgroundColor: colors.danger }]}
            onPress={() => setDeleteTarget(expense)}
          >
            <MaterialCommunityIcons name="delete-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      >
        <ExpenseCard
          description={expense.description}
          amount={`$${(Number(expense.totalAmountCents) / 100).toFixed(2)}`}
          payerName={payer?.name ?? 'Unknown'}
          payerInitials={getInitials(payer?.name ?? 'U')}
          participantCount={participantCount}
          date={new Date(expense.createdAt).toLocaleDateString()}
          onPress={() => navigation.navigate('ExpenseDetail', { expenseId: expense.id })}
        />
      </Swipeable>
    );
  };

  const deleteExpense = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      await expenseService.remove(deleteTarget.id);
      toast('Expense deleted');
      setDeleteTarget(null);
      await load();
    } catch {
      toast('Failed to delete expense');
    }
  };

  if (loading) {
    return <SkeletonList rows={5} />;
  }

  const renderExpenseSection = (title: string, expenses: ExpenseDto[], delay: number) => {
    if (expenses.length === 0) return null;
    return (
      <Animated.View entering={FadeInDown.duration(400).delay(delay)}>
        <SectionHeader title={title} />
        {expenses.map(renderExpenseCard)}
      </Animated.View>
    );
  };

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Summary */}
        {summary && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.balanceSection}>
            <View style={styles.balanceRow}>
              <View style={{ flex: 1 }}>
                <BalanceCard
                  title="Total Spent"
                  amount={`$${(Number(summary.totalExpensesCents) / 100).toFixed(2)}`}
                  icon="cash-multiple"
                  variant="default"
                />
              </View>
            </View>
            <View style={styles.balanceRow}>
              <View style={{ flex: 1 }}>
                <BalanceCard
                  title="Your Balance"
                  amount={`$${Math.abs(userBalance).toFixed(2)}`}
                  subtitle={userBalance > 0 ? 'You are owed' : userBalance < 0 ? 'You owe' : 'Settled up'}
                  icon={userBalance >= 0 ? 'trending-up' : 'trending-down'}
                  variant={userBalance > 0 ? 'success' : userBalance < 0 ? 'danger' : 'default'}
                />
              </View>
            </View>
          </Animated.View>
        )}

        {/* Members */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <SectionHeader
            title="Members"
            action="View All"
            onActionPress={() => navigation.navigate('GroupMembers', { groupId: route.params.groupId })}
          />
          <View style={styles.membersRow}>
            <MemberAvatarStack
              members={members.map((m) => ({ userId: m.userId, name: m.name, avatarUrl: m.avatarUrl }))}
              maxVisible={6}
              size={44}
            />
            <Text style={[styles.memberCount, { color: colors.text_secondary }]}>
              {members.length} member{members.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('AddExpense', { groupId: route.params.groupId })}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>Add Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor: 'transparent',
                borderWidth: 1.5,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => navigation.navigate('SettleUp', { groupId: route.params.groupId })}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="handshake" size={18} color={colors.primary} />
            <Text style={[styles.actionBtnText, { color: colors.primary }]}>Settle Up</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Expense History */}
        {renderExpenseSection('Today', groupedExpenses.today, 300)}
        {renderExpenseSection('This Week', groupedExpenses.week, 400)}
        {renderExpenseSection('Older', groupedExpenses.older, 500)}

        {expenses.length === 0 && (
          <Animated.View entering={FadeInDown.duration(400).delay(300)}>
            <EmptyState kind="no_expenses" title="No expenses yet" />
          </Animated.View>
        )}
      </ScrollView>

      <FloatingActionButton
        onPress={() => navigation.navigate('AddExpense', { groupId: route.params.groupId })}
      />

      {/* Delete Confirmation Modal */}
      <Modal transparent visible={Boolean(deleteTarget)} onRequestClose={() => setDeleteTarget(null)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDark ? colors.card : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={[styles.modalIconBg, { backgroundColor: `${colors.danger}18` }]}>
              <MaterialCommunityIcons name="delete-alert" size={32} color={colors.danger} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text_primary }]}>
              Delete Expense?
            </Text>
            <Text style={[styles.modalDesc, { color: colors.text_secondary }]}>
              {deleteTarget?.description}
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.danger }]}
                onPress={() => void deleteExpense()}
              >
                <Text style={styles.modalBtnText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.muted }]}
                onPress={() => setDeleteTarget(null)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  balanceSection: {
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  balanceRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  memberCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    borderRadius: 14,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderRadius: 14,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
  },
  modalIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  modalDesc: {
    fontSize: 14,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
