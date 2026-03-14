import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';

interface SectionHeaderProps {
  title: string;
  action?: string;
  onActionPress?: () => void;
}

export function SectionHeader({ title, action, onActionPress }: SectionHeaderProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          { color: colors.text_primary },
        ]}
      >
        {title.toUpperCase()}
      </Text>
      {action ? (
        <TouchableOpacity 
          onPress={onActionPress} 
          style={[styles.actionBadge, { backgroundColor: colors.primary }]}
        >
          <Text
            style={[styles.action, { color: colors.background }]}
          >
            {action.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  action: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
