import React from 'react';
import { StyleSheet, View } from 'react-native';
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
        <Text
          style={[styles.action, { color: colors.primary }]}
          onPress={onActionPress}
        >
          {action}
        </Text>
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
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  action: {
    fontSize: 14,
    fontWeight: '600',
  },
});
