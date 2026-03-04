import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import { useGroupStore } from '../store/groupStore';
import { groupService } from '../services/group.service';
import { ListItem } from '../components/ui/ListItem';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { useToastStore } from '../store/toastStore';

export function GroupListScreen({ navigation }: { navigation: { navigate: (route: string, params?: any) => void } }) {
  const groups = useGroupStore((state) => state.groups);
  const setGroups = useGroupStore((state) => state.setGroups);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const toast = useToastStore((state) => state.show);

  const loadGroups = React.useCallback(async () => {
    try {
      const data = await groupService.list();
      setGroups(data);
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void loadGroups(); }} />}>
        <Text variant="headlineSmall" style={{ padding: 16 }}>Groups</Text>
        {groups.length === 0 ? (
          <EmptyState title="No groups yet" />
        ) : (
          groups.map((group) => (
            <ListItem
              key={group.id}
              title={group.name}
              description={group.currency}
              onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}
            />
          ))
        )}
      </ScrollView>
      <FAB icon="plus" style={{ position: 'absolute', right: 16, bottom: 16 }} onPress={() => navigation.navigate('AddExpense', { groupId: groups[0]?.id ?? '' })} />
    </>
  );
}
