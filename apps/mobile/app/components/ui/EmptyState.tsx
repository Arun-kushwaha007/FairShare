import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export function EmptyState({ title }: { title: string }) {
  return (
    <View style={{ padding: 24, alignItems: 'center' }}>
      <Text variant="titleMedium">{title}</Text>
    </View>
  );
}
