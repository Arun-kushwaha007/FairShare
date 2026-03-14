import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { groupService } from '../services/group.service';
import { useToastStore } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';
import { BalanceCard } from '../components/BalanceCard';
import { SectionHeader } from '../components/SectionHeader';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { startScreenLoad, endScreenLoad } from '../utils/perf';

interface QuickActionItem {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  color: string;
}

export function HomeScreen({ navigation }: { navigation: { navigate: (route: string, params?: any) => void } }) {
  const [firstGroupId, setFirstGroupId] = React.useState<string>('');
  const [totalGroups, setTotalGroups] = React.useState(0);
  const [recentActivities, setRecentActivities] = React.useState<
    Array<{ type: string; createdAt: string }>
  >([]);
  const toast = useToastStore((state) => state.show);
  const user = useAuthStore((state) => state.user);
  const { colors, isDark } = useAppTheme();

  React.useEffect(() => {
    startScreenLoad('Dashboard');
    const load = async () => {
      try {
        const groups = await groupService.list();
        setTotalGroups(groups.length);
        if (groups.length === 0) {
          return;
        }

        setFirstGroupId(groups[0].id);
        const activity = await groupService.activity(groups[0].id);
        if (activity.items.length > 0) {
          setRecentActivities(
            activity.items.slice(0, 5).map((item) => ({
              type: item.type.replace(/_/g, ' '),
              createdAt: item.createdAt,
            })),
          );
        }
      } catch {
        toast('Failed to load dashboard');
      } finally {
        endScreenLoad('Dashboard');
      }
    };

    void load();
  }, [toast]);

  const quickActions: QuickActionItem[] = [
    {
      icon: 'plus-circle-outline',
      label: 'Add Expense',
      color: colors.primary,
      onPress: () => {
        if (!firstGroupId) {
          navigation.navigate('CreateGroup');
          return;
        }
        navigation.navigate('AddExpense', { groupId: firstGroupId });
      },
    },
    {
      icon: 'handshake-outline',
      label: 'Settle Up',
      color: colors.success,
      onPress: () => {
        if (!firstGroupId) {
          navigation.navigate('CreateGroup');
          return;
        }
        navigation.navigate('SettleUp', { groupId: firstGroupId });
      },
    },
    {
      icon: 'account-group-outline',
      label: 'Groups',
      color: colors.warning,
      onPress: () => navigation.navigate('Groups' as any),
    },
  ];

  const formatRelativeTime = (iso: string) => {
    const now = Date.now();
    const ts = new Date(iso).getTime();
    const diff = Math.floor((now - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text_secondary }]}>
              Welcome back,
            </Text>
            <Text style={[styles.name, { color: colors.text_primary }]}>
              {user?.name ?? 'Guest'}
            </Text>
          </View>
        </Animated.View>

        {/* Balance Cards */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.balanceRow}>
          <View style={{ flex: 1 }}>
            <BalanceCard
              title="Groups"
              amount={String(totalGroups)}
              subtitle="Active"
              icon="account-group"
              variant="default"
            />
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <SectionHeader title="Quick Actions" />
          <View style={styles.quickActionRow}>
            {quickActions.map((action, i) => (
              <Animated.View
                key={action.label}
                entering={FadeInRight.duration(400).delay(300 + i * 100)}
                style={{ flex: 1 }}
              >
                <TouchableOpacity
                  style={[
                    styles.quickAction,
                    {
                      backgroundColor: isDark ? colors.card : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={action.onPress}
                  activeOpacity={0.7}
                >
                  <View style={[styles.quickIconBg, { backgroundColor: `${action.color}18` }]}>
                    <MaterialCommunityIcons
                      name={action.icon}
                      size={24}
                      color={action.color}
                    />
                  </View>
                  <Text
                    style={[styles.quickLabel, { color: colors.text_primary }]}
                    numberOfLines={1}
                  >
                    {action.label}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInDown.duration(500).delay(400)}>
          <SectionHeader title="Recent Activity" />
          {recentActivities.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: isDark ? colors.card : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="history"
                size={40}
                color={colors.muted}
              />
              <Text style={{ color: colors.text_secondary, marginTop: spacing.sm }}>
                No recent activity
              </Text>
            </View>
          ) : (
            recentActivities.map((activity, i) => (
              <View
                key={i}
                style={[
                  styles.activityItem,
                  {
                    backgroundColor: isDark ? colors.card : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={[styles.activityDot, { backgroundColor: colors.primary }]} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.activityText, { color: colors.text_primary }]}
                    numberOfLines={1}
                  >
                    {activity.type}
                  </Text>
                  <Text style={[styles.activityTime, { color: colors.text_secondary }]}>
                    {formatRelativeTime(activity.createdAt)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Animated.View>
      </ScrollView>

      <FloatingActionButton
        onPress={() => {
          if (!firstGroupId) {
            navigation.navigate('CreateGroup');
            return;
          }
          navigation.navigate('AddExpense', { groupId: firstGroupId });
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  header: {
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  balanceRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickAction: {
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    gap: spacing.sm,
  },
  quickIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCard: {
    borderRadius: 16,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    borderWidth: 1,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  activityTime: {
    fontSize: 12,
    marginTop: 2,
  },
});
