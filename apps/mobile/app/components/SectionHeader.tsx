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
        {title}
      </Text>
      {action ? (
        <TouchableOpacity 
          onPress={onActionPress} 
          style={styles.actionContainer}
        >
          <Text
            style={[styles.action, { color: colors.primary }]}
          >
            {action}
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
    alignItems: 'flex-end',
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  actionContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  action: {
    fontSize: 13,
    fontWeight: '600',
  },
});
