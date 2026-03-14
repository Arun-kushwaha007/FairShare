import React from 'react';
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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

export function GroupListScreen({ navigation }: { navigation: any }) {
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
      toast('FAILED TO LOAD GROUPS');
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
      headerTitle: 'GROUPS',
      headerTitleStyle: { fontWeight: '900', letterSpacing: 1 },
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
            <Text style={[styles.heading, { color: colors.text_primary }]}>GROUPS</Text>
            <View style={styles.badge}>
              <Text style={[styles.badgeText, { color: colors.background }]}>
                {groups.length} TOTAL
              </Text>
            </View>
          </Animated.View>
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              kind="no_groups"
              title="NO GROUPS YET"
              actionLabel="CREATE GROUP"
              onAction={() => navigation.navigate('CreateGroup')}
            />
          ) : null
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.duration(400).delay(100 + index * 60)}>
            <ListItem
              title={item.name.toUpperCase()}
              description={item.currency.toUpperCase()}
              leftIcon="account-group"
              onPress={() => navigation.navigate('GroupDetail', { groupId: item.id })}
            />
          </Animated.View>
        )}
      />

      <FloatingActionButton
        onPress={() => navigation.navigate('CreateGroup')}
        icon="plus-thick"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  heading: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },
  badge: {
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
  },
});

function HeaderPlusButton({ onPress }: { onPress: () => void }) {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity onPress={onPress} style={{ marginRight: spacing.md }}>
      <MaterialCommunityIcons name="plus-thick" size={24} color={colors.primary} />
    </TouchableOpacity>
  );
}
