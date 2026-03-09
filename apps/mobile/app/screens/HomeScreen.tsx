import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { groupService } from '../services/group.service';
import { useToastStore } from '../store/toastStore';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { startScreenLoad, endScreenLoad } from '../utils/perf';

export function HomeScreen({ navigation }: { navigation: { navigate: (route: string, params?: any) => void } }) {
  const [firstGroupId, setFirstGroupId] = React.useState<string>('');
  const [recentActivity, setRecentActivity] = React.useState<string>('No recent activity');
  const toast = useToastStore((state) => state.show);
  const { colors } = useAppTheme();

  React.useEffect(() => {
    startScreenLoad('Dashboard');
    const load = async () => {
      try {
        const groups = await groupService.list();
        if (groups.length === 0) {
          return;
        }

        setFirstGroupId(groups[0].id);
        const activity = await groupService.activity(groups[0].id);
        if (activity.items.length > 0) {
          setRecentActivity(activity.items[0].type.replace('_', ' '));
        }
      } catch {
        toast('Failed to load dashboard');
      } finally {
        endScreenLoad('Dashboard');
      }
    };

    void load();
  }, [toast]);

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}
      >
        <Animated.View entering={FadeInDown.duration(400)} style={{ gap: spacing.md }}>
          <Text
            variant="headlineMedium"
            style={{ color: colors.text_primary, fontWeight: '700' }}
          >
            Dashboard
          </Text>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: spacing.lg,
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text style={{ color: colors.text_secondary, fontSize: 13, marginBottom: 4 }}>
              RECENT ACTIVITY
            </Text>
            <Text style={{ color: colors.text_primary, fontSize: 16, fontWeight: '500' }}>
              {recentActivity}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      <FloatingActionButton
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

