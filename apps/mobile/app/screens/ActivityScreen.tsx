import React from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { List, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ActivityDto, ActivityType } from '@fairshare/shared-types';
import { groupService } from '../services/group.service';
import { useToastStore } from '../store/toastStore';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const PAGE_SIZE = 12;

const iconByType: Record<ActivityType, keyof typeof MaterialCommunityIcons.glyphMap> = {
  expense_created: 'receipt',
  expense_updated: 'file-document-edit',
  expense_deleted: 'delete',
  settlement_created: 'cash',
  member_joined: 'account-plus',
  member_invited: 'account-arrow-right',
};

const actionText = (activity: ActivityDto): string => {
  const actor = activity.actorUserId;
  switch (activity.type) {
    case 'expense_created':
      return `${actor} created an expense`;
    case 'expense_updated':
      return `${actor} updated an expense`;
    case 'expense_deleted':
      return `${actor} deleted an expense`;
    case 'settlement_created':
      return `${actor} recorded a settlement`;
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

export function ActivityScreen({ route }: { route?: { params?: { groupId?: string } } }) {
  const groupId = route?.params?.groupId;
  const toast = useToastStore((state) => state.show);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [events, setEvents] = React.useState<ActivityDto[]>([]);
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);

  const loadEvents = React.useCallback(async () => {
    if (!groupId) {
      setEvents([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const data = await groupService.activity(groupId);
      setEvents(data);
      setVisibleCount(PAGE_SIZE);
    } catch {
      toast('Failed to load activity');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [groupId, toast]);

  React.useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const visibleItems = React.useMemo(() => events.slice(0, visibleCount), [events, visibleCount]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <FlatList
      data={visibleItems}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void loadEvents(); }} />}
      onEndReachedThreshold={0.4}
      onEndReached={() => {
        if (visibleCount < events.length) {
          setVisibleCount((count) => count + PAGE_SIZE);
        }
      }}
      ListHeaderComponent={<Text variant="headlineSmall" style={{ padding: 16 }}>Activity</Text>}
      ListEmptyComponent={<EmptyState title="No activity yet" />}
      renderItem={({ item }) => {
        const amountCents = extractAmountCents(item);
        const amountText = amountCents ? ` Ã‚Â· $${(Number(amountCents) / 100).toFixed(2)}` : '';

        return (
          <List.Item
            title={actionText(item)}
            description={`${relativeTime(item.createdAt)}${amountText}`}
            left={() => (
              <View style={{ justifyContent: 'center', paddingLeft: 12 }}>
                <MaterialCommunityIcons name={iconByType[item.type]} size={22} />
              </View>
            )}
          />
        );
      }}
    />
  );
}


