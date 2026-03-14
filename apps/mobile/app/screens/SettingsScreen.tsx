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
    { mode: 'light', label: 'LIGHT MODE', icon: 'white-balance-sunny' },
    { mode: 'dark', label: 'DARK MODE', icon: 'moon-waning-crescent' },
    { mode: 'system', label: 'SYSTEM DEFAULT', icon: 'cellphone-cog' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <SectionHeader title="APPEARANCE" />
      
      <View style={styles.optionsContainer}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.mode}
            style={[
              styles.option,
              {
                backgroundColor: themeMode === option.mode ? colors.primary : colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setThemeMode(option.mode)}
            activeOpacity={0.8}
          >
            {themeMode === option.mode && <View style={styles.optionShadow} />}
            <View style={styles.optionContent}>
              <MaterialCommunityIcons 
                name={option.icon} 
                size={24} 
                color={themeMode === option.mode ? colors.background : colors.text_primary} 
              />
              <Text 
                style={[
                  styles.optionLabel, 
                  { color: themeMode === option.mode ? colors.background : colors.text_primary }
                ]}
              >
                {option.label}
              </Text>
              {themeMode === option.mode && (
                <MaterialCommunityIcons name="check-bold" size={20} color={colors.background} />
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
    height: 60,
    position: 'relative',
  },
  optionShadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: '#000000',
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    borderWidth: 2,
    gap: spacing.md,
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
