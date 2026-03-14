import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
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
  const { colors } = useAppTheme();

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
      icon: 'plus-thick',
      label: 'ADD EXPENSE',
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
      icon: 'handshake',
      label: 'SETTLE UP',
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
      icon: 'account-group',
      label: 'GROUPS',
      color: colors.warning,
      onPress: () => navigation.navigate('Groups' as any),
    },
  ];

  const formatRelativeTime = (iso: string) => {
    const now = Date.now();
    const ts = new Date(iso).getTime();
    const diff = Math.floor((now - ts) / 1000);
    if (diff < 60) return `${diff}S AGO`;
    if (diff < 3600) return `${Math.floor(diff / 60)}M AGO`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}H AGO`;
    return `${Math.floor(diff / 86400)}D AGO`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text_secondary }]}>
              WELCOME BACK,
            </Text>
            <Text style={[styles.name, { color: colors.text_primary }]}>
              {user?.name?.toUpperCase() ?? 'GUEST'}
            </Text>
          </View>
        </Animated.View>

        {/* Balance Cards */}
        <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.balanceRow}>
          <View style={{ flex: 1 }}>
            <BalanceCard
              title="GROUPS"
              amount={String(totalGroups)}
              subtitle="ACTIVE"
              icon="account-group"
              variant="default"
            />
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <SectionHeader title="QUICK ACTIONS" />
          <View style={styles.quickActionRow}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={action.onPress}
                activeOpacity={0.8}
              >
                <View style={styles.quickActionShadow} />
                <View style={styles.quickActionContent}>
                  <MaterialCommunityIcons name={action.icon} size={28} color={action.color} />
                  <Text style={[styles.quickLabel, { color: colors.text_primary }]}>
                    {action.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInDown.duration(500).delay(400)}>
          <SectionHeader title="RECENT ACTIVITY" />
          {recentActivities.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
               <View style={styles.emptyCardShadow} />
               <View style={styles.emptyCardContent}>
                <MaterialCommunityIcons name="history" size={48} color={colors.muted} />
                <Text style={[styles.emptyText, { color: colors.text_secondary }]}>
                  NO RECENT ACTIVITY
                </Text>
              </View>
            </View>
          ) : (
            recentActivities.map((activity, i) => (
              <View key={i} style={[styles.activityItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.activityDot, { backgroundColor: colors.primary }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.activityText, { color: colors.text_primary }]}>
                    {activity.type.toUpperCase()}
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
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  header: {
    marginBottom: spacing.xxl,
    marginTop: spacing.md,
    borderLeftWidth: 8,
    borderLeftColor: '#00FF41', // Accent stripe
    paddingLeft: spacing.md,
  },
  greeting: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  name: {
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 40,
    marginTop: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  quickActionRow: {
    flexDirection: 'column',
    gap: spacing.lg,
  },
  quickAction: {
    height: 72,
    position: 'relative',
  },
  quickActionShadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    backgroundColor: '#000000',
    borderRadius: 0,
  },
  quickActionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    borderWidth: 3,
    backgroundColor: '#FFFFFF',
    gap: spacing.lg,
  },
  quickLabel: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  emptyCard: {
    height: 160,
    position: 'relative',
  },
  emptyCardShadow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: -8,
    bottom: -8,
    backgroundColor: '#000000',
  },
  emptyCardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    backgroundColor: '#FFFFFF',
    gap: spacing.md,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    gap: spacing.lg,
  },
  activityDot: {
    width: 12,
    height: 12,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  activityTime: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 1,
  },
});
