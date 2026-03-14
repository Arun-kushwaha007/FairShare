import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, HelperText, TextInput, useTheme } from 'react-native-paper';
import { groupService } from '../services/group.service';
import { useToastStore } from '../store/toastStore';
import { useGroupStore } from '../store/groupStore';
import { getErrorMessage } from '../utils/error';
import { useAppTheme } from '../theme/useAppTheme';
import { spacing } from '../theme/spacing';
import { CurrencyCode } from '@fairshare/shared-types';

type CreateGroupForm = {
  name: string;
  currency: CurrencyCode;
};

export function CreateGroupScreen({ navigation }: { navigation: any }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateGroupForm>({
    defaultValues: {
      name: '',
      currency: 'USD',
    },
  });

  const toast = useToastStore((state) => state.show);
  const setGroups = useGroupStore((state) => state.setGroups);
  const groups = useGroupStore((state) => state.groups);
  const { colors } = useAppTheme();

  const onSubmit = handleSubmit(async (values) => {
    try {
      const newGroup = await groupService.create(values);
      setGroups([newGroup, ...groups]);
      toast('Group created successfully');
      navigation.goBack();
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to create group');
      toast(message);
    }
  });

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.form}>
        <Controller
          control={control}
          name="name"
          rules={{
            required: 'Group name is required',
            minLength: { value: 3, message: 'Name must be at least 3 characters' },
          }}
          render={({ field: { value, onChange } }) => (
            <TextInput
              label="Group Name"
              value={value}
              onChangeText={onChange}
              error={Boolean(errors.name)}
              mode="outlined"
              placeholder="e.g. Summer Trip 2024"
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              style={{ backgroundColor: colors.surface }}
            />
          )}
        />
        <HelperText type="error" visible={Boolean(errors.name)}>
          {errors.name?.message}
        </HelperText>

        <Controller
          control={control}
          name="currency"
          rules={{ required: 'Currency is required' }}
          render={({ field: { value, onChange } }) => (
            <TextInput
              label="Currency"
              value={value}
              onChangeText={onChange}
              error={Boolean(errors.currency)}
              mode="outlined"
              placeholder="USD, EUR, INR"
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              style={{ backgroundColor: colors.surface }}
              autoCapitalize="characters"
            />
          )}
        />
        <HelperText type="error" visible={Boolean(errors.currency)}>
          {errors.currency?.message}
        </HelperText>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={onSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitButton}
            contentStyle={styles.buttonContent}
          >
            Create Group
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
            textColor={colors.text_secondary}
            style={[styles.cancelButton, { borderColor: colors.border }]}
          >
            Cancel
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  form: {
    gap: spacing.xs,
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  submitButton: {
    borderRadius: 12,
  },
  buttonContent: {
    height: 48,
  },
  cancelButton: {
    borderRadius: 12,
  },
});
