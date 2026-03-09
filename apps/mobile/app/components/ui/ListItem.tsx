import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/useAppTheme';
import { spacing } from '../../theme/spacing';

interface ListItemProps {
  title: string;
  description?: string;
  onPress?: () => void;
  leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

export function ListItem({ title, description, onPress, leftIcon }: ListItemProps) {
  const { colors, isDark } = useAppTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.card : colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {leftIcon && (
        <View style={[styles.iconBg, { backgroundColor: `${colors.primary}15` }]}>
          <MaterialCommunityIcons name={leftIcon} size={20} color={colors.primary} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text_primary }]} numberOfLines={1}>
          {title}
        </Text>
        {description ? (
          <Text style={[styles.description, { color: colors.text_secondary }]} numberOfLines={1}>
            {description}
          </Text>
        ) : null}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={colors.muted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
    gap: spacing.md,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    marginTop: 2,
  },
});
