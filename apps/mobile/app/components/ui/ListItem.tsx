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
  const { colors } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.shadow, { backgroundColor: colors.border }]} />
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        {leftIcon && (
          <View style={[styles.iconBg, { backgroundColor: colors.primary }]}>
            <MaterialCommunityIcons name={leftIcon} size={24} color={colors.background} />
          </View>
        )}
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text_primary }]} numberOfLines={1}>
            {title.toUpperCase()}
          </Text>
          {description ? (
            <Text style={[styles.description, { color: colors.text_secondary }]} numberOfLines={1}>
              {description.toUpperCase()}
            </Text>
          ) : null}
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    position: 'relative',
  },
  shadow: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: -4,
    bottom: -4,
    backgroundColor: '#000000',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderWidth: 2,
    gap: spacing.lg,
  },
  iconBg: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  description: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
