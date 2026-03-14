import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '../../theme/useAppTheme';
import { spacing } from '../../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      {/* Hard Shadow */}
      <View style={[styles.shadow, { backgroundColor: colors.border }]} />
      
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 8,
    marginRight: 8,
  },
  card: {
    borderRadius: 4,
    padding: spacing.lg,
    borderWidth: 2,
  },
  shadow: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: -6,
    bottom: -6,
    borderRadius: 4,
  },
});
