import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export function SkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <View style={{ padding: spacing.md }}>
      {Array.from({ length: rows }).map((_, idx) => (
        <View
          key={idx}
          style={{
            height: 56,
            borderRadius: 8,
            marginBottom: 12,
            backgroundColor: '#E2E8F0',
          }}
        />
      ))}
      <View style={{ marginTop: spacing.sm, alignItems: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    </View>
  );
}
