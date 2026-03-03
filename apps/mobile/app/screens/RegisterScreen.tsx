import React from 'react';
import { View, Text, Button } from 'react-native';

export function RegisterScreen({ navigation }: { navigation: { navigate: (route: string) => void } }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 12 }}>Register</Text>
      <Button title="Back to Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}
