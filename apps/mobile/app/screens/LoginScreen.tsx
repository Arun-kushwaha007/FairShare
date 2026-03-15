import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { HelperText, TextInput, Text } from 'react-native-paper';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { getErrorMessage } from '../utils/error';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';
import { Button } from '../components/ui/Button';

type LoginForm = { email: string; password: string };

export function LoginScreen({ navigation }: { navigation: { navigate: (route: string) => void } }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ defaultValues: { email: '', password: '' } });
  const setSession = useAuthStore((state) => state.setSession);
  const toast = useToastStore((state) => state.show);
  const { colors, typography } = useAppTheme();

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await authService.login(values);
      await setSession(res.accessToken, res.refreshToken, res.user);
    } catch (error) {
      const message = getErrorMessage(error, 'Login failed');
      toast(message);
    }
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.logoPlaceholder, { backgroundColor: colors.primary }]}>
             <Text style={styles.logoText}>FS</Text>
          </View>
          <Text style={[typography.h1, { color: colors.text_primary, marginTop: spacing.lg }]}>FairShare</Text>
          <Text style={[typography.bodyMedium, { color: colors.text_secondary, marginTop: spacing.xs }]}>
            Sign in to your royal dashboard
          </Text>
        </View>

        <View style={styles.form}>
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
                mode="outlined"
                outlineStyle={{ borderRadius: 12 }}
                style={styles.input}
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
                mode="outlined"
                outlineStyle={{ borderRadius: 12 }}
                style={styles.input}
              />
            )}
          />
          <HelperText type="error" visible={Boolean(errors.password)}>
            {errors.password?.message}
          </HelperText>

          <Button onPress={onSubmit} loading={isSubmitting} style={styles.loginButton}>
            Sign In
          </Button>
          
          <TouchableOpacity 
            style={styles.registerLink} 
            onPress={() => navigation.navigate('Register')}
            disabled={isSubmitting}
          >
            <Text style={[typography.bodyMedium, { color: colors.text_secondary }]}>
              New to FairShare? <Text style={{ color: colors.primary, fontWeight: '700' }}>Create account</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import { TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center', // Centers the content vertically
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  loginButton: {
    marginTop: spacing.md,
  },
  registerLink: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
});
