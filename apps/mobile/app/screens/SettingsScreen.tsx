import React from 'react';
import { ScrollView } from 'react-native';
import { Text } from 'react-native-paper';

export function SettingsScreen() {
  return (
    <ScrollView style={{ padding: 16 }}>
      <Text variant="headlineSmall">Settings</Text>
      <Text>Notification and account settings.</Text>
    </ScrollView>
  );
}
