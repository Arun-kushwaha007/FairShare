import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Text } from 'react-native-paper';
import { useAppTheme } from '../../theme/useAppTheme';
import { spacing } from '../../theme/spacing';

type EmptyStateKind = 'no_groups' | 'no_expenses' | 'no_activity' | 'default';

const iconByKind: Record<EmptyStateKind, keyof typeof MaterialCommunityIcons.glyphMap> = {
  no_groups: 'account-group-outline',
  no_expenses: 'file-document-outline',
  no_activity: 'timeline-clock-outline',
  default: 'information-outline',
};

const subtitleByKind: Record<EmptyStateKind, string> = {
  no_groups: 'Create your first group to start splitting expenses',
  no_expenses: 'Add an expense to track spending',
  no_activity: 'Activity will appear here when things happen',
  default: '',
};

export function EmptyState({
  title,
  kind = 'default',
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  kind?: EmptyStateKind;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { colors, isDark } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? colors.card : colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.iconBg, { backgroundColor: `${colors.primary}12` }]}>
        <MaterialCommunityIcons
          name={iconByKind[kind]}
          size={48}
          color={colors.muted}
        />
      </View>
      <Text
        style={[styles.title, { color: colors.text_primary }]}
      >
        {title}
      </Text>
      <Text style={[styles.subtitle, { color: colors.text_secondary }]}>
        {subtitle ?? subtitleByKind[kind]}
      </Text>
      {actionLabel && onAction && (
        <Button
          mode="contained"
          onPress={onAction}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xxl,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  iconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  button: {
    marginTop: spacing.md,
    borderRadius: 8,
  },
  buttonContent: {
    paddingHorizontal: spacing.md,
  },
});
