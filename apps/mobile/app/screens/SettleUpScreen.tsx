import React from 'react';
import { Linking, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import type { ActivityDto, GroupMemberSummaryDto, SimplifySuggestionDto } from '@fairshare/shared-types';
import LottieView from 'lottie-react-native';
import { settlementService } from '../services/settlement.service';
import { groupService } from '../services/group.service';
import { useToastStore } from '../store/toastStore';
import { spacing } from '../theme/spacing';

const suggestionKey = (fromUserId: string, toUserId: string, amountCents: string) => `${fromUserId}-${toUserId}-${amountCents}`;

const relativeTime = (iso: string): string => {
  const now = Date.now();
  const timestamp = new Date(iso).getTime();
  const diffSec = Math.max(1, Math.floor((now - timestamp) / 1000));

  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
};

export function SettleUpScreen({ route }: { route: { params: { groupId: string } } }) {
  const [suggestions, setSuggestions] = React.useState<SimplifySuggestionDto[]>([]);
  const [members, setMembers] = React.useState<GroupMemberSummaryDto[]>([]);
  const [reminderEvents, setReminderEvents] = React.useState<ActivityDto[]>([]);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [upiReceiver, setUpiReceiver] = React.useState('');
  const [upiName, setUpiName] = React.useState('FairShare Member');
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [remindingKey, setRemindingKey] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');
  const [fromUserId, setFromUserId] = React.useState('');
  const [toUserId, setToUserId] = React.useState('');
  const toast = useToastStore((state) => state.show);

  React.useEffect(() => {
    const load = async () => {
      try {
        const [nextSuggestions, nextMembers, activityData] = await Promise.all([
          groupService.simplify(route.params.groupId),
          groupService.members(route.params.groupId),
          groupService.activity(route.params.groupId, 0, 20),
        ]);
        setSuggestions(nextSuggestions);
        setMembers(nextMembers);
        setReminderEvents(activityData.items.filter((event) => event.type === 'settlement_reminder'));
      } catch {
        toast('Failed to load suggestions');
      }
    };

    void load();
  }, [route.params.groupId, toast]);

  const labelForUser = (userId: string) => members.find((member) => member.userId === userId)?.name ?? userId;

  const filteredSuggestions = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return suggestions.filter((item) => {
      if (fromUserId && item.fromUserId !== fromUserId) {
        return false;
      }
      if (toUserId && item.toUserId !== toUserId) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }

      const amount = (Number(item.amountCents) / 100).toFixed(2);
      const haystack = [labelForUser(item.fromUserId), labelForUser(item.toUserId), amount].join(' ').toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [fromUserId, query, suggestions, toUserId, members]);

  const latestReminderBySuggestion = React.useMemo(() => {
    const entries = new Map<string, ActivityDto>();

    reminderEvents.forEach((event) => {
      const payerId = typeof event.metadata?.payerId === 'string' ? event.metadata.payerId : null;
      const receiverId = typeof event.metadata?.receiverId === 'string' ? event.metadata.receiverId : null;
      const amountCents = typeof event.metadata?.amountCents === 'string' ? event.metadata.amountCents : null;
      if (!payerId || !receiverId || !amountCents) {
        return;
      }

      const key = suggestionKey(payerId, receiverId, amountCents);
      const existing = entries.get(key);
      if (!existing || new Date(event.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
        entries.set(key, event);
      }
    });

    return entries;
  }, [reminderEvents]);

  const recentReminders = React.useMemo(
    () =>
      [...reminderEvents]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4),
    [reminderEvents],
  );

  const resetFilters = () => {
    setQuery('');
    setFromUserId('');
    setToUserId('');
  };

  return (
    <>
      <ScrollView style={{ padding: 16 }} contentContainerStyle={styles.container}>
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

        <View style={styles.filterCard}>
          <TextInput
            mode="outlined"
            label="Search settlements"
            value={query}
            onChangeText={setQuery}
            style={styles.filterInput}
            placeholder="Search payer, receiver, amount"
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            <TouchableOpacity style={[styles.chip, !fromUserId && styles.chipActive]} onPress={() => setFromUserId('')}>
              <Text style={[styles.chipText, !fromUserId && styles.chipTextActive]}>All payers</Text>
            </TouchableOpacity>
            {members.map((member) => {
              const selected = fromUserId === member.userId;
              return (
                <TouchableOpacity key={`from-${member.userId}`} style={[styles.chip, selected && styles.chipActive]} onPress={() => setFromUserId(selected ? '' : member.userId)}>
                  <Text style={[styles.chipText, selected && styles.chipTextActive]}>{member.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            <TouchableOpacity style={[styles.chip, !toUserId && styles.chipActive]} onPress={() => setToUserId('')}>
              <Text style={[styles.chipText, !toUserId && styles.chipTextActive]}>All receivers</Text>
            </TouchableOpacity>
            {members.map((member) => {
              const selected = toUserId === member.userId;
              return (
                <TouchableOpacity key={`to-${member.userId}`} style={[styles.chip, selected && styles.chipActive]} onPress={() => setToUserId(selected ? '' : member.userId)}>
                  <Text style={[styles.chipText, selected && styles.chipTextActive]}>{member.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={styles.filterFooter}>
            <Text style={styles.filterSummary}>Showing {filteredSuggestions.length} of {suggestions.length} suggestions</Text>
            {(query || fromUserId || toUserId) ? (
              <Button mode="text" onPress={resetFilters}>Reset</Button>
            ) : null}
          </View>
        </View>

        {recentReminders.length > 0 ? (
          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>Recent reminders</Text>
            {recentReminders.map((event) => {
              const payerId = typeof event.metadata?.payerId === 'string' ? event.metadata.payerId : '';
              const receiverId = typeof event.metadata?.receiverId === 'string' ? event.metadata.receiverId : '';
              const amountCents = typeof event.metadata?.amountCents === 'string' ? event.metadata.amountCents : '0';

              return (
                <View key={event.id} style={styles.historyItem}>
                  <Text style={styles.historyText}>
                    {labelForUser(event.actorUserId)} reminded {labelForUser(payerId)} to pay {labelForUser(receiverId)}
                  </Text>
                  <Text style={styles.historyMeta}>
                    ${(Number(amountCents) / 100).toFixed(2)} • {relativeTime(event.createdAt)}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : null}

        {filteredSuggestions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.title}>{suggestions.length === 0 ? 'All clear' : 'No matching settlements'}</Text>
            <Text style={styles.amount}>{suggestions.length === 0 ? 'No suggested settlements right now.' : 'Try a different payer, receiver, or search query.'}</Text>
          </View>
        ) : null}

        {filteredSuggestions.map((item, index) => {
          const key = suggestionKey(item.fromUserId, item.toUserId, item.amountCents);
          const latestReminder = latestReminderBySuggestion.get(key);

          return (
            <View key={`${key}-${index}`} style={styles.card}>
              <Text style={styles.title}>
                {labelForUser(item.fromUserId)} pays {labelForUser(item.toUserId)}
              </Text>
              <Text style={styles.amount}>${(Number(item.amountCents) / 100).toFixed(2)}</Text>
              {latestReminder ? (
                <Text style={styles.reminderStatus}>
                  Last reminded {relativeTime(latestReminder.createdAt)} by {labelForUser(latestReminder.actorUserId)}
                </Text>
              ) : null}
              <View style={styles.actionRow}>
                <Button
                  mode="outlined"
                  style={styles.actionButton}
                  loading={remindingKey === key}
                  disabled={remindingKey === key}
                  onPress={async () => {
                    try {
                      setRemindingKey(key);
                      const result = await groupService.remindSettlement(route.params.groupId, {
                        payerId: item.fromUserId,
                        receiverId: item.toUserId,
                        amountCents: item.amountCents,
                      });
                      setReminderEvents((prev) => [result.activity, ...prev.filter((event) => event.id !== result.activity.id)]);
                      toast(`Reminder sent to ${labelForUser(item.fromUserId)}`);
                    } catch {
                      toast('Failed to send reminder');
                    } finally {
                      setRemindingKey(null);
                    }
                  }}
                >
                  Remind
                </Button>
                <Button
                  mode="outlined"
                  style={styles.actionButton}
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
                  Pay via UPI
                </Button>
              </View>
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
          );
        })}
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

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
  },
  filterCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.24)',
    gap: spacing.sm,
  },
  filterInput: {
    backgroundColor: 'transparent',
  },
  chipRow: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.24)',
  },
  chipActive: {
    borderColor: '#4F46E5',
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  chipTextActive: {
    color: '#4F46E5',
  },
  filterFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterSummary: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  historyCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.24)',
    gap: spacing.sm,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  historyItem: {
    gap: 2,
  },
  historyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  historyMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.24)',
    gap: spacing.xs,
  },
  card: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.24)',
    gap: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  amount: {
    fontSize: 14,
    color: '#6B7280',
  },
  reminderStatus: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
