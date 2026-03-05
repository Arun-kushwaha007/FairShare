import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';

type EmptyStateKind = 'no_groups' | 'no_expenses' | 'no_activity' | 'default';

const iconByKind: Record<EmptyStateKind, keyof typeof MaterialCommunityIcons.glyphMap> = {
  no_groups: 'account-group-outline',
  no_expenses: 'file-document-outline',
  no_activity: 'timeline-clock-outline',
  default: 'information-outline',
};

export function EmptyState({ title, kind = 'default' }: { title: string; kind?: EmptyStateKind }) {
  return (
    <View style={{ padding: 24, alignItems: 'center', gap: 8 }}>
      <MaterialCommunityIcons name={iconByKind[kind]} size={42} color="#64748B" />
      <Text variant="titleMedium">{title}</Text>
    </View>
  );
}


