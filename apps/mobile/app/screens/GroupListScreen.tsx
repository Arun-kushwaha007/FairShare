import React from 'react';
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useGroupStore } from '../store/groupStore';
import { groupService } from '../services/group.service';
import { expenseService } from '../services/expense.service';
import { ListItem } from '../components/ui/ListItem';
import { EmptyState } from '../components/ui/EmptyState';
import { useToastStore } from '../store/toastStore';
import { useAppTheme } from '../theme/useAppTheme';
import { SkeletonList } from '../components/ui/SkeletonList';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { spacing } from '../theme/spacing';
import type { RecurringExpenseDto } from '@fairshare/shared-types';

const isRecurringDue = (item: RecurringExpenseDto) => new Date(item.nextOccurrenceAt).getTime() <= Date.now();

export function GroupListScreen({ navigation }: { navigation: any }) {
  const groups = useGroupStore((state) => state.groups);
  const setGroups = useGroupStore((state) => state.setGroups);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [overdueRecurringByGroup, setOverdueRecurringByGroup] = React.useState<Record<string, number>>({});
  const toast = useToastStore((state) => state.show);
  const { colors } = useAppTheme();

  const loadGroups = React.useCallback(async () => {
    try {
      const data = await groupService.list();
      setGroups(data);
      const recurringEntries = await Promise.all(
        data.map(async (group) => {
          try {
            const recurringExpenses = await expenseService.listRecurring(group.id);
            return [group.id, recurringExpenses.filter(isRecurringDue).length] as const;
          } catch {
            return [group.id, 0] as const;
          }
        }),
      );
      setOverdueRecurringByGroup(Object.fromEntries(recurringEntries));
    } catch {
      toast('Failed to load groups');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [setGroups, toast]);

  React.useEffect(() => {
    void loadGroups();
  }, [loadGroups]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Groups',
      headerTitleStyle: { fontWeight: '700' },
      headerRight: () => <HeaderPlusButton onPress={() => navigation.navigate('CreateGroup')} />,
    });
  }, [navigation]);

  if (loading) {
    return <SkeletonList rows={6} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        data={groups}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              void loadGroups();
            }}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
            <Text style={[styles.heading, { color: colors.text_primary }]}>Your Groups</Text>
            <View style={[styles.badge, { backgroundColor: `${colors.primary}15` }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                {groups.length} total
              </Text>
            </View>
          </Animated.View>
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              kind="no_groups"
              title="No groups yet"
              actionLabel="Create Group"
              onAction={() => navigation.navigate('CreateGroup')}
            />
          ) : null
        }
        renderItem={({ item, index }) => {
          const overdueCount = overdueRecurringByGroup[item.id] ?? 0;
          const description = overdueCount > 0 ? `${item.currency} • ${overdueCount} recurring due` : item.currency;

          return (
            <Animated.View entering={FadeInDown.duration(400).delay(100 + index * 60)}>
              <ListItem
                title={item.name}
                description={description}
                leftIcon="account-group-outline"
                onPress={() => navigation.navigate('GroupDetail', { groupId: item.id })}
              />
            </Animated.View>
          );
        }}
      />

      <FloatingActionButton
        onPress={() => navigation.navigate('CreateGroup')}
        icon="plus"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
    paddingTop: spacing.md,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});

function HeaderPlusButton({ onPress }: { onPress: () => void }) {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity onPress={onPress} style={{ marginRight: spacing.md }}>
      <MaterialCommunityIcons name="plus" size={24} color={colors.primary} />
    </TouchableOpacity>
  );
}
