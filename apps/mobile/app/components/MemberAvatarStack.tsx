import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../theme/useAppTheme';

interface MemberAvatarData {
  userId: string;
  name: string;
  avatarUrl?: string | null;
}

interface MemberAvatarStackProps {
  members: MemberAvatarData[];
  maxVisible?: number;
  size?: number;
}

export const MemberAvatarStack = memo(function MemberAvatarStack({
  members,
  maxVisible = 5,
  size = 40,
}: MemberAvatarStackProps) {
  const { colors, isDark } = useAppTheme();
  const visibleMembers = members.slice(0, maxVisible);
  const remaining = members.length - maxVisible;

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const avatarColors = ['#6366F1', '#EC4899', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <View style={styles.container}>
      {visibleMembers.map((member, i) => (
        <View
          key={member.userId}
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: avatarColors[i % avatarColors.length],
              borderColor: isDark ? colors.surface : colors.card,
              marginLeft: i > 0 ? -(size * 0.3) : 0,
              zIndex: visibleMembers.length - i,
            },
          ]}
        >
          <Text style={[styles.initials, { fontSize: size * 0.35 }]}>
            {getInitials(member.name)}
          </Text>
        </View>
      ))}
      {remaining > 0 && (
        <View
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: colors.muted,
              borderColor: isDark ? colors.surface : colors.card,
              marginLeft: -(size * 0.3),
              zIndex: 0,
            },
          ]}
        >
          <Text style={[styles.initials, { fontSize: size * 0.3 }]}>
            +{remaining}
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
