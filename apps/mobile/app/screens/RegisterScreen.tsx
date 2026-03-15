import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { HelperText, TextInput, Text } from 'react-native-paper';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { getErrorMessage } from '../utils/error';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';
import { Button } from '../components/ui/Button';

type RegisterForm = { name: string; email: string; password: string };

export function RegisterScreen({ navigation }: { navigation: { goBack: () => void } }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ defaultValues: { name: '', email: '', password: '' } });
  const setSession = useAuthStore((state) => state.setSession);
  const toast = useToastStore((state) => state.show);
  const { colors, typography } = useAppTheme();

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await authService.register(values);
      await setSession(res.accessToken, res.refreshToken, res.user);
    } catch (error) {
      const message = getErrorMessage(error, 'Registration failed');
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
          <Text style={[typography.h1, { color: colors.text_primary }]}>Join FairShare</Text>
          <Text style={[typography.bodyMedium, { color: colors.text_secondary, marginTop: spacing.xs }]}>
            Start your royal expense journey
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            }}
            render={({ field: { value, onChange } }) => (
              <TextInput 
                label="Full Name" 
                value={value} 
                onChangeText={onChange} 
                error={Boolean(errors.name)} 
                mode="outlined"
                outlineStyle={{ borderRadius: 12 }}
                style={styles.input}
              />
            )}
          />
          <HelperText type="error" visible={Boolean(errors.name)}>
            {errors.name?.message}
          </HelperText>

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

          <Button onPress={onSubmit} loading={isSubmitting} style={styles.registerButton}>
            Create Account
          </Button>

          <TouchableOpacity 
            style={styles.loginLink} 
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
          >
            <Text style={[typography.bodyMedium, { color: colors.text_secondary }]}>
              Already have an account? <Text style={{ color: colors.primary, fontWeight: '700' }}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  registerButton: {
    marginTop: spacing.md,
  },
  loginLink: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
});
