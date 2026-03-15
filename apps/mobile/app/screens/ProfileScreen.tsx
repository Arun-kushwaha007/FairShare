import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthStore } from '../store/authStore';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';

export function ProfileScreen({ navigation }: { navigation: { navigate: (route: string) => void } }) {
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const { colors, typography } = useAppTheme();

  const menuItems = [
    {
      icon: 'cog-outline' as const,
      label: 'Settings',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'shield-check-outline' as const,
      label: 'Privacy & Security',
      onPress: () => {},
    },
    {
      icon: 'help-circle-outline' as const,
      label: 'Help & Support',
      onPress: () => {},
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
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerSpacer} />
      
      {/* Profile Header Card */}
      <Animated.View entering={FadeInDown.duration(400)}>
        <Card variant="elevated" style={styles.profileCard}>
          <Avatar name={user?.name ?? 'Guest'} size={80} />
          <View style={styles.userInfo}>
            <Text style={[typography.h2, { color: colors.text_primary }]}>
              {user?.name ?? 'Guest'}
            </Text>
            <Text style={[typography.bodyMedium, { color: colors.text_secondary, marginTop: 4 }]}>
              {user?.email ?? 'Not signed in'}
            </Text>
          </View>
          {/* Brutalist Accent */}
          <View style={[styles.brutalistAccent, { backgroundColor: colors.primary }]} />
        </Card>
      </Animated.View>

      {/* Menu Sections */}
      <View style={styles.menuSection}>
        <SectionHeader title="Account Management" />
        {menuItems.map((item, i) => (
          <Animated.View 
            key={item.label}
            entering={FadeInDown.duration(400).delay(200 + i * 100)}
          >
            <TouchableOpacity onPress={item.onPress} activeOpacity={0.8}>
              <Card variant="default" style={styles.menuItem}>
                <View
                  style={[
                    styles.menuIconBg,
                    {
                      backgroundColor: item.danger ? `${colors.danger}12` : `${colors.primary}12`,
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
              </Card>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={[typography.caption, { color: colors.muted }]}>
          FairShare Royal Edition v1.2.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: 60,
  },
  headerSpacer: {
    height: spacing.sm,
  },
  profileCard: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: spacing.xxl,
    marginBottom: spacing.xxl,
    gap: spacing.md,
  },
  userInfo: {
    alignItems: 'center',
  },
  menuSection: {
    gap: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  menuIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  brutalistAccent: {
    position: 'absolute',
    left: 0,
    top: 40,
    bottom: 40,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  footer: {
    marginTop: spacing.xxxl,
    alignItems: 'center',
  }
});
