import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export function LoadingSpinner() {
  return (
    <View style={{ padding: 24, alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
