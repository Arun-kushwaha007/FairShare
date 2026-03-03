import React from 'react';
import { View, Text } from 'react-native';

export function AddExpenseScreen({ route }: { route: { params: { groupId: string } } }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 24 }}>Add Expense for {route.params.groupId}</Text>
    </View>
  );
}
