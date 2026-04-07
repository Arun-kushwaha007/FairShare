import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { formatCurrencyFromCents, type ActivityDto, type ActivityType } from '@fairshare/shared-types';
import { groupService } from '../services/group.service';
import { useToastStore } from '../store/toastStore';
import { useAppTheme } from '../theme/useAppTheme';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/SkeletonList';
import { spacing } from '../theme/spacing';

const PAGE_SIZE = 20;

const iconByType: Record<ActivityType, keyof typeof MaterialCommunityIcons.glyphMap> = {
  expense_created: 'receipt',
  expense_updated: 'file-document-edit',
  expense_deleted: 'delete',
  settlement_created: 'cash',
  settlement_reminder: 'bell-ring-outline',
  member_joined: 'account-plus',
  member_invited: 'account-arrow-right',
};

const colorByType: Record<ActivityType, string> = {
  expense_created: '#6366F1',
  expense_updated: '#F59E0B',
  expense_deleted: '#EF4444',
  settlement_created: '#22C55E',
  settlement_reminder: '#8B5CF6',
  member_joined: '#14B8A6',
  member_invited: '#EC4899',
};

const actionText = (activity: ActivityDto): string => {
  const actor = activity.actorName ?? activity.actorUserId;
  switch (activity.type) {
    case 'expense_created':
      return `${actor} created an expense`;
    case 'expense_updated':
      return `${actor} updated an expense`;
    case 'expense_deleted':
      return `${actor} deleted an expense`;
    case 'settlement_created':
      return `${actor} recorded a settlement`;
    case 'settlement_reminder': {
      const payerName = typeof activity.metadata?.payerName === 'string' ? activity.metadata.payerName : 'a member';
      const receiverName = typeof activity.metadata?.receiverName === 'string' ? activity.metadata.receiverName : 'another member';
      return `${actor} reminded ${payerName} to pay ${receiverName}`;
    }
    case 'member_joined':
      return `${actor} joined the group`;
    case 'member_invited':
      return `${actor} invited a member`;
    default:
      return `${actor} performed an action`;
  }
};

const extractAmountCents = (activity: ActivityDto): string | null => {
  const raw = activity.metadata?.amountCents ?? activity.metadata?.totalAmountCents;
  return typeof raw === 'string' ? raw : null;
};

const resolveActivityCurrency = (activity: ActivityDto) => {
  const currency = activity.metadata?.currency;
  return currency === 'USD' || currency === 'EUR' || currency === 'INR' ? currency : 'USD';
};

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

/**
 * Render the Activity screen showing a scrollable, paginated list of activity events for a specific group or the current user.
 *
 * The screen loads the first page on mount, supports pull-to-refresh and infinite scroll pagination, animates item entry,
 * and displays loading or empty states as appropriate. Amounts and currencies are resolved from activity metadata when available.
 *
 * @param route - Optional navigation route; if `route.params.groupId` is provided the screen shows that group's activity, otherwise it shows the current user's activity.
 * @returns The rendered Activity screen element.
 */
export function ActivityScreen({ route }: { route?: { params?: { groupId?: string } } }) {
  const groupId = route?.params?.groupId;
  const toast = useToastStore((state) => state.show);
  const { colors, isDark } = useAppTheme();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [events, setEvents] = React.useState<ActivityDto[]>([]);
  const [nextCursor, setNextCursor] = React.useState<number | null>(0);

  const loadFirstPage = React.useCallback(async () => {
    try {
      const data = groupId
        ? await groupService.activity(groupId, 0, PAGE_SIZE)
        : await groupService.userActivity(0, PAGE_SIZE);
      setEvents(data.items);
      setNextCursor(data.nextCursor);
    } catch {
      toast('Failed to load activity');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [groupId, toast]);

  React.useEffect(() => {
    void loadFirstPage();
  }, [loadFirstPage]);

  const loadMore = async () => {
    if (nextCursor === null) return;

    try {
      const data = groupId
        ? await groupService.activity(groupId, nextCursor, PAGE_SIZE)
        : await groupService.userActivity(nextCursor, PAGE_SIZE);
      setEvents((prev) => [...prev, ...data.items]);
      setNextCursor(data.nextCursor);
    } catch {
      toast('Failed to load more activity');
    }
  };

  if (loading) {
    return <SkeletonList rows={8} />;
  }

  const renderItem = ({ item, index }: { item: ActivityDto; index: number }) => {
    const amountCents = extractAmountCents(item);
    const amountText = amountCents ? formatCurrencyFromCents(amountCents, resolveActivityCurrency(item)) : null;
    const iconColor = colorByType[item.type] ?? colors.primary;

    return (
      <Animated.View entering={FadeInDown.duration(300).delay(index * 40)}>
        <View
          style={[
            styles.activityCard,
            {
              backgroundColor: isDark ? colors.card : colors.surface,
              borderColor: colors.border,
            },
          ]}
          accessibilityLabel={actionText(item)}
        >
          <View style={[styles.iconBg, { backgroundColor: `${iconColor}18` }]}>
            <MaterialCommunityIcons name={iconByType[item.type] || 'information-outline'} size={20} color={iconColor} />
          </View>
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text_primary }]} numberOfLines={2}>
              {actionText(item)}
            </Text>
            <Text style={[styles.time, { color: colors.text_secondary }]}>
              {item.groupName ? `${item.groupName} • ${relativeTime(item.createdAt)}` : relativeTime(item.createdAt)}
            </Text>
          </View>
          {amountText && (
            <Text style={[styles.amount, { color: colors.text_primary }]}>{amountText}</Text>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            void loadFirstPage();
          }}
        />
      }
      onEndReachedThreshold={0.4}
      onEndReached={() => {
        void loadMore();
      }}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={[styles.heading, { color: colors.text_primary }]}>Activity</Text>
        </View>
      }
      ListEmptyComponent={<EmptyState kind="no_activity" title="No activity yet" />}
    />
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
    gap: spacing.md,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
  },
});
