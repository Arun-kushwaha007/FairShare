import React from 'react';
import { View, Text, Button } from 'react-native';

export function GroupDetailScreen({
  route,
  navigation,
}: {
  route: { params: { groupId: string } };
  navigation: { navigate: (route: string, params: { groupId: string }) => void };
}) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 12 }}>Group: {route.params.groupId}</Text>
      <Button title="Add Expense" onPress={() => navigation.navigate('AddExpense', { groupId: route.params.groupId })} />
    </View>
  );
}
