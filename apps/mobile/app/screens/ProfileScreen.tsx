import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthStore } from '../store/authStore';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';

export function ProfileScreen({ navigation }: { navigation: { navigate: (route: string) => void } }) {
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const { colors, isDark } = useAppTheme();

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const menuItems = [
    {
      icon: 'cog-outline' as const,
      label: 'Settings',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'logout' as const,
      label: 'Logout',
      danger: true,
      onPress: () => void clearSession(),
    },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Profile Header */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={[
          styles.profileCard,
          {
            backgroundColor: isDark ? colors.card : colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {getInitials(user?.name ?? 'G')}
          </Text>
        </View>
        <Text style={[styles.name, { color: colors.text_primary }]}>
          {user?.name ?? 'Guest'}
        </Text>
        <Text style={[styles.email, { color: colors.text_secondary }]}>
          {user?.email ?? 'Not signed in'}
        </Text>
      </Animated.View>

      {/* Menu Items */}
      <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.menuSection}>
        {menuItems.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.menuItem,
              {
                backgroundColor: isDark ? colors.card : colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={item.onPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={item.label}
          >
            <View
              style={[
                styles.menuIconBg,
                {
                  backgroundColor: item.danger
                    ? `${colors.danger}15`
                    : `${colors.primary}15`,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={20}
                color={item.danger ? colors.danger : colors.primary}
              />
            </View>
            <Text
              style={[
                styles.menuLabel,
                {
                  color: item.danger ? colors.danger : colors.text_primary,
                },
              ]}
            >
              {item.label}
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.muted} />
          </TouchableOpacity>
        ))}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  profileCard: {
    alignItems: 'center',
    padding: spacing.xxl,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 28,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
  menuSection: {
    gap: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: 14,
    borderWidth: 1,
    gap: spacing.md,
  },
  menuIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
});
