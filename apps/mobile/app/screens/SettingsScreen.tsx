import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/useAppTheme';
import { useThemeStore, ThemeMode } from '../store/themeStore';
import { spacing } from '../theme/spacing';
import { SectionHeader } from '../components/SectionHeader';
import { Card } from '../components/ui/Card';

export function SettingsScreen() {
  const { colors, typography } = useAppTheme();
  const { themeMode, setThemeMode } = useThemeStore();

  const themeOptions: { mode: ThemeMode; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
    { mode: 'light', label: 'Light Mode', icon: 'white-balance-sunny' },
    { mode: 'dark', label: 'Dark Mode', icon: 'moon-waning-crescent' },
    { mode: 'system', label: 'System Default', icon: 'cellphone-cog' },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <SectionHeader title="Appearance" />
      
      <View style={styles.optionsContainer}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.mode}
            onPress={() => setThemeMode(option.mode)}
            activeOpacity={0.8}
          >
            <Card 
              variant={themeMode === option.mode ? 'elevated' : 'default'}
              style={[
                styles.optionCard,
                themeMode === option.mode && { borderColor: colors.primary, borderWidth: 2 }
              ]}
            >
              <View style={styles.optionContent}>
                <View style={[
                  styles.iconBg, 
                  { backgroundColor: themeMode === option.mode ? `${colors.primary}15` : `${colors.primary}08` }
                ]}>
                  <MaterialCommunityIcons 
                    name={option.icon} 
                    size={24} 
                    color={themeMode === option.mode ? colors.primary : colors.muted} 
                  />
                </View>
                <Text 
                  style={[
                    styles.optionLabel, 
                    { color: themeMode === option.mode ? colors.text_primary : colors.text_secondary }
                  ]}
                >
                  {option.label}
                </Text>
                {themeMode === option.mode && (
                  <MaterialCommunityIcons name="check-circle" size={24} color={colors.primary} />
                )}
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoSection}>
        <SectionHeader title="About FairShare" />
        <Card style={styles.infoCard}>
           <Text style={[typography.bodyMedium, { color: colors.text_secondary }]}>
             FairShare is built for royal expense management. Split bills with elegance and precision.
           </Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  optionsContainer: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  optionCard: {
    padding: 0,
    marginBottom: spacing.xs,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  infoSection: {
    marginTop: spacing.xxl,
  },
  infoCard: {
    marginTop: spacing.sm,
    padding: spacing.xl,
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    borderWidth: 1,
  }
});
