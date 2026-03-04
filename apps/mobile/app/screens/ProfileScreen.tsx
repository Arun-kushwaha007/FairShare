import React from 'react';
import { ScrollView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';

export function ProfileScreen({ navigation }: { navigation: { navigate: (route: string) => void } }) {
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text variant="headlineSmall">Profile</Text>
      <Text>{user?.name ?? 'Guest'}</Text>
      <Text>{user?.email ?? '-'}</Text>
      <Button onPress={() => navigation.navigate('Settings')}>Settings</Button>
      <Button onPress={() => void clearSession()}>Logout</Button>
    </ScrollView>
  );
}
