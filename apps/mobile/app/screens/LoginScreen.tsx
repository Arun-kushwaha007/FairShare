import React from 'react';
import { View, Text, Button } from 'react-native';

export function LoginScreen({ navigation }: { navigation: { navigate: (route: string) => void } }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 12 }}>Login</Text>
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
      <View style={{ height: 12 }} />
      <Button title="Continue" onPress={() => navigation.navigate('GroupList')} />
    </View>
  );
}
