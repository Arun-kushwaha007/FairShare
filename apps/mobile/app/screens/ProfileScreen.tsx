import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthStore } from '../store/authStore';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';
import { SectionHeader } from '../components/SectionHeader';

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
      <SectionHeader title="Profile" />

      {/* Profile Header */}
      <Animated.View entering={FadeInDown.duration(400)}>
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {getInitials(user?.name ?? 'Guest')}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.name, { color: colors.text_primary }]}>
              {user?.name ?? 'Guest'}
            </Text>
            <Text style={[styles.email, { color: colors.text_secondary }]}>
              {user?.email ?? 'Not signed in'}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <SectionHeader title="Account" />
        {menuItems.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.menuItem,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.menuIconBg,
                {
                  backgroundColor: item.danger ? `${colors.danger}15` : `${colors.primary}15`,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={22}
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: spacing.xl,
    // Soft shadow
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xl,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  email: {
    fontSize: 14,
    marginTop: 2,
  },
  menuSection: {
    gap: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.md,
    marginBottom: spacing.sm,
    // Subtle shadow
    shadowColor: 'rgba(0,0,0,0.03)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
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
