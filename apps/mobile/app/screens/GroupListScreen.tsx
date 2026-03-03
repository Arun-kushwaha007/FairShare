import React from 'react';
import { View, Text, Button } from 'react-native';

export function GroupListScreen({ navigation }: { navigation: { navigate: (route: string, params?: { groupId: string }) => void } }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 12 }}>Groups</Text>
      <Button title="Open Group" onPress={() => navigation.navigate('GroupDetail', { groupId: 'demo-group' })} />
    </View>
  );
}
