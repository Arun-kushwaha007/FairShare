import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useGroupStore } from '../store/groupStore';
import { groupService } from '../services/group.service';
import { ListItem } from '../components/ui/ListItem';
import { EmptyState } from '../components/ui/EmptyState';
import { useToastStore } from '../store/toastStore';
import { useAppTheme } from '../theme/useAppTheme';
import { SkeletonList } from '../components/ui/SkeletonList';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { spacing } from '../theme/spacing';

export function GroupListScreen({ navigation }: { navigation: { navigate: (route: string, params?: any) => void } }) {
  const groups = useGroupStore((state) => state.groups);
  const setGroups = useGroupStore((state) => state.setGroups);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const toast = useToastStore((state) => state.show);
  const { colors } = useAppTheme();

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
    return <SkeletonList rows={6} />;
  }

  return (
    <>
      <FlatList
        style={{ flex: 1, backgroundColor: colors.background }}
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
          />
        }
        ListHeaderComponent={
          <Animated.View entering={FadeInDown.duration(400)}>
            <Text style={[styles.heading, { color: colors.text_primary }]}>Groups</Text>
            <Text style={[styles.subHeading, { color: colors.text_secondary }]}>
              {groups.length} group{groups.length !== 1 ? 's' : ''}
            </Text>
          </Animated.View>
        }
        ListEmptyComponent={
          !loading ? <EmptyState kind="no_groups" title="No groups yet" /> : null
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.duration(400).delay(100 + index * 60)}>
            <ListItem
              title={item.name}
              description={item.currency}
              leftIcon="account-group"
              onPress={() => navigation.navigate('GroupDetail', { groupId: item.id })}
            />
          </Animated.View>
        )}
      />


      {groups.length > 0 && (
        <FloatingActionButton
          onPress={() => navigation.navigate('AddExpense', { groupId: groups[0]?.id ?? '' })}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: spacing.lg,
    paddingBottom: 120,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    paddingHorizontal: spacing.lg,
  },
  subHeading: {
    fontSize: 14,
    paddingHorizontal: spacing.lg,
    marginTop: 2,
  },
});
