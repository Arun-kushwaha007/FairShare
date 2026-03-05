import React from 'react';
import { ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { getErrorMessage } from '../utils/error';

type LoginForm = { email: string; password: string };

export function LoginScreen({ navigation }: { navigation: { navigate: (route: string) => void } }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ defaultValues: { email: '', password: '' } });
  const setSession = useAuthStore((state) => state.setSession);
  const toast = useToastStore((state) => state.show);

  const onSubmit = handleSubmit(async (values) => {
    console.log('[auth-ui] login submit clicked');

    if (values.password.length < 8) {
      console.log('[auth-ui] login validation failed: short password');
      toast('Password must be at least 8 characters');
      return;
    }

    try {
      console.log('[auth-ui] login request start', { email: values.email.toLowerCase() });
      const res = await authService.login(values);
      await setSession(res.accessToken, res.refreshToken, res.user);
      console.log('[auth-ui] login success', { userId: res.user.id });
    } catch (error) {
      const message = getErrorMessage(error, 'Login failed');
      console.log('[auth-ui] login failed', { message, error });
      toast(message);
    }
  });

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
      <Controller
        control={control}
        name="email"
        rules={{
          required: 'Email is required',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
        }}
        render={({ field: { value, onChange } }) => (
          <TextInput
            label="Email"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            keyboardType="email-address"
            error={Boolean(errors.email)}
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.email)}>
        {errors.email?.message}
      </HelperText>

      <Controller
        control={control}
        name="password"
        rules={{
          required: 'Password is required',
          minLength: { value: 8, message: 'Password must be at least 8 characters' },
        }}
        render={({ field: { value, onChange } }) => (
          <TextInput
            secureTextEntry
            label="Password"
            value={value}
            onChangeText={onChange}
            error={Boolean(errors.password)}
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.password)}>
        {errors.password?.message}
      </HelperText>

      <Button mode="contained" onPress={onSubmit} loading={isSubmitting} disabled={isSubmitting}>
        Login
      </Button>
      <Button onPress={() => navigation.navigate('Register')} disabled={isSubmitting}>
        Create Account
      </Button>
    </ScrollView>
  );
}
