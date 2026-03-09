import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Image } from 'expo-image';
import { useAppTheme } from '../../theme/useAppTheme';

interface AvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: number;
}

const AVATAR_COLORS = ['#6366F1', '#EC4899', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6'];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function Avatar({ name, avatarUrl, size = 40 }: AvatarProps) {
  const { colors } = useAppTheme();

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const bgColor = AVATAR_COLORS[hashCode(name) % AVATAR_COLORS.length];

  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
        contentFit="cover"
        accessibilityLabel={`${name}'s avatar`}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bgColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      accessibilityLabel={`${name}'s avatar`}
    >
      <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: size * 0.38 }}>
        {initials}
      </Text>
    </View>
  );
}