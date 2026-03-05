import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button, FAB, Text } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { groupService } from '../services/group.service';
import { useToastStore } from '../store/toastStore';
import { spacing } from '../theme/spacing';

export function HomeScreen({ navigation }: { navigation: { navigate: (route: string, params?: any) => void } }) {
  const [firstGroupId, setFirstGroupId] = React.useState<string>('');
  const [recentActivity, setRecentActivity] = React.useState<string>('No recent activity');
  const toast = useToastStore((state) => state.show);

  React.useEffect(() => {
    const load = async () => {
      try {
        const groups = await groupService.list();
        if (groups.length === 0) {
          return;
        }

        setFirstGroupId(groups[0].id);
        const activity = await groupService.activity(groups[0].id);
        if (activity.length > 0) {
          setRecentActivity(activity[0].type.replace('_', ' '));
        }
      } catch {
        toast('Failed to load dashboard');
      }
    };

    void load();
  }, [toast]);

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 120 }}>
        <Animated.View entering={FadeInDown.duration(400)} style={{ gap: spacing.sm }}>
          <Text variant="headlineSmall">Dashboard</Text>
          <Text variant="bodyMedium">Recent activity: {recentActivity}</Text>

          <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
            <Button mode="contained" onPress={() => navigation.navigate('Tabs')}>
              Open Groups/Activity/Profile
            </Button>
            <Button
              mode="outlined"
              onPress={() => {
                if (!firstGroupId) {
                  toast('Create a group first');
                  return;
                }
                navigation.navigate('AddExpense', { groupId: firstGroupId });
              }}
            >
              Quick Add Expense
            </Button>
            <Button
              mode="outlined"
              onPress={() => {
                if (!firstGroupId) {
                  toast('Create a group first');
                  return;
                }
                navigation.navigate('SettleUp', { groupId: firstGroupId });
              }}
            >
              Quick Settle Suggestion
            </Button>
          </View>
        </Animated.View>
      </ScrollView>

      <FAB
        icon="plus"
        style={{ position: 'absolute', right: spacing.md, bottom: spacing.md }}
        onPress={() => {
          if (!firstGroupId) {
            toast('Create a group first');
            return;
          }
          navigation.navigate('AddExpense', { groupId: firstGroupId });
        }}
      />
    </>
  );
}
