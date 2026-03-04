import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export function SkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <SkeletonPlaceholder>
      <View style={{ padding: 16 }}>
        {Array.from({ length: rows }).map((_, idx) => (
          <View key={idx} style={{ height: 56, borderRadius: 8, marginBottom: 12 }} />
        ))}
      </View>
    </SkeletonPlaceholder>
  );
}
