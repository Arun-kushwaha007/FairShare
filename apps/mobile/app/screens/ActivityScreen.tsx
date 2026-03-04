import React from 'react';
import { ScrollView } from 'react-native';
import { Text } from 'react-native-paper';

export function ActivityScreen() {
  return (
    <ScrollView style={{ padding: 16 }}>
      <Text variant="headlineSmall">Activity</Text>
      <Text>Recent expenses and settlements will appear here.</Text>
    </ScrollView>
  );
}
