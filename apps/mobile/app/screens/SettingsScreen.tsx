import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/useAppTheme';
import { useThemeStore, ThemeMode } from '../store/themeStore';
import { spacing } from '../theme/spacing';
import { SectionHeader } from '../components/SectionHeader';

export function SettingsScreen() {
  const { colors } = useAppTheme();
  const { themeMode, setThemeMode } = useThemeStore();

  const themeOptions: { mode: ThemeMode; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
    { mode: 'light', label: 'Light Mode', icon: 'white-balance-sunny' },
    { mode: 'dark', label: 'Dark Mode', icon: 'moon-waning-crescent' },
    { mode: 'system', label: 'System Default', icon: 'cellphone-cog' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <SectionHeader title="Appearance" />
      
      <View style={styles.optionsContainer}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.mode}
            style={[
              styles.option,
              {
                backgroundColor: themeMode === option.mode ? colors.primary : colors.surface,
                borderColor: themeMode === option.mode ? colors.primary : colors.border,
                // Soft shadow if active
                shadowColor: themeMode === option.mode ? colors.primary : 'rgba(0,0,0,0.05)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: themeMode === option.mode ? 0.3 : 1,
                shadowRadius: themeMode === option.mode ? 8 : 4,
                elevation: themeMode === option.mode ? 6 : 2,
              },
            ]}
            onPress={() => setThemeMode(option.mode)}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <View style={[
                  styles.iconBg, 
                  { backgroundColor: themeMode === option.mode ? '#FFFFFF20' : `${colors.primary}10` }
                ]}>
                <MaterialCommunityIcons 
                  name={option.icon} 
                  size={24} 
                  color={themeMode === option.mode ? '#FFFFFF' : colors.primary} 
                />
              </View>
              <Text 
                style={[
                  styles.optionLabel, 
                  { color: themeMode === option.mode ? '#FFFFFF' : colors.text_primary }
                ]}
              >
                {option.label}
              </Text>
              {themeMode === option.mode && (
                <MaterialCommunityIcons name="check-circle" size={24} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  optionsContainer: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  option: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
});
