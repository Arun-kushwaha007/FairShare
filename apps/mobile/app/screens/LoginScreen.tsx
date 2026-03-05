import React from 'react';
import { ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextInput } from 'react-native-paper';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { getErrorMessage } from '../utils/error';

type LoginForm = { email: string; password: string };

export function LoginScreen({ navigation }: { navigation: { navigate: (route: string) => void } }) {
  const { control, handleSubmit } = useForm<LoginForm>({ defaultValues: { email: '', password: '' } });
  const setSession = useAuthStore((state) => state.setSession);
  const toast = useToastStore((state) => state.show);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await authService.login(values);
      await setSession(res.accessToken, res.refreshToken, res.user);
    } catch (error) {
      const message = getErrorMessage(error, 'Login failed');
      console.log('[auth] login failed:', message, error);
      toast(message);
    }
  });

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Controller control={control} name="email" render={({ field: { value, onChange } }) => <TextInput label="Email" value={value} onChangeText={onChange} />} />
      <Controller control={control} name="password" render={({ field: { value, onChange } }) => <TextInput secureTextEntry label="Password" value={value} onChangeText={onChange} />} />
      <Button mode="contained" onPress={onSubmit}>Login</Button>
      <Button onPress={() => navigation.navigate('Register')}>Create Account</Button>
    </ScrollView>
  );
}
