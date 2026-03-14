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
  const { colors } = useAppTheme();

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const menuItems = [
    {
      icon: 'cog' as const,
      label: 'SETTINGS',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'logout' as const,
      label: 'LOGOUT',
      danger: true,
      onPress: () => void clearSession(),
    },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
    >
      <SectionHeader title="PROFILE" />

      {/* Profile Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.headerWrapper}>
        <View style={styles.headerShadow} />
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {getInitials(user?.name ?? 'G')}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.name, { color: colors.text_primary }]}>
              {user?.name?.toUpperCase() ?? 'GUEST'}
            </Text>
            <Text style={[styles.email, { color: colors.text_secondary }]}>
              {user?.email?.toUpperCase() ?? 'NOT SIGNED IN'}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Menu Items */}
      <SectionHeader title="ACCOUNT" />
      <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.menuSection}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuItemWrapper}
            onPress={item.onPress}
            activeOpacity={0.8}
          >
            <View style={styles.menuItemShadow} />
            <View style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View
                style={[
                  styles.menuIconBg,
                  {
                    backgroundColor: item.danger ? colors.danger : colors.primary,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={colors.background}
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
              <MaterialCommunityIcons name="chevron-right" size={24} color={colors.primary} />
            </View>
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
  headerWrapper: {
    position: 'relative',
    marginBottom: spacing.xl,
  },
  headerShadow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: -8,
    bottom: -8,
    backgroundColor: '#000000',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
    borderWidth: 3,
    gap: spacing.xl,
  },
  avatar: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#000000',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 28,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
  email: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 1,
  },
  menuSection: {
    gap: spacing.lg,
  },
  menuItemWrapper: {
    position: 'relative',
    height: 72,
  },
  menuItemShadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    backgroundColor: '#000000',
  },
  menuItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    borderWidth: 3,
    gap: spacing.lg,
  },
  menuIconBg: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
