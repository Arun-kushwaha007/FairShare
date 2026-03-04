import React from 'react';
import { ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextInput } from 'react-native-paper';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

type RegisterForm = { name: string; email: string; password: string };

export function RegisterScreen() {
  const { control, handleSubmit } = useForm<RegisterForm>({ defaultValues: { name: '', email: '', password: '' } });
  const setSession = useAuthStore((state) => state.setSession);
  const toast = useToastStore((state) => state.show);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await authService.register(values);
      await setSession(res.accessToken, res.refreshToken, res.user);
    } catch {
      toast('Registration failed');
    }
  });

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Controller control={control} name="name" render={({ field: { value, onChange } }) => <TextInput label="Name" value={value} onChangeText={onChange} />} />
      <Controller control={control} name="email" render={({ field: { value, onChange } }) => <TextInput label="Email" value={value} onChangeText={onChange} />} />
      <Controller control={control} name="password" render={({ field: { value, onChange } }) => <TextInput secureTextEntry label="Password" value={value} onChangeText={onChange} />} />
      <Button mode="contained" onPress={onSubmit}>Register</Button>
    </ScrollView>
  );
}
