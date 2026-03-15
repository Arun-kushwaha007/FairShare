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

export function Avatar({ name, avatarUrl, size = 40 }: AvatarProps) {
  const { colors, shadows } = useAppTheme();

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Royal SaaS uses Primary Royal Purple as the default avatar background
  const bgColor = colors.primary;

  const content = avatarUrl ? (
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
  ) : (
    <View
      style={[
        styles.initialsContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
        },
      ]}
      accessibilityLabel={`${name}'s avatar`}
    >
      <Text style={[styles.initialsText, { fontSize: size * 0.38 }]}>
        {initials}
      </Text>
      {/* Inset highlight for skeuomorphism */}
      <View style={[styles.highlight, { borderRadius: size / 2, backgroundColor: colors.insetHighlight }]} />
    </View>
  );

  return (
    <View style={[styles.wrapper, { width: size, height: size }, shadows.soft]}>
      {content}
      {/* Subtle outer border for contrast */}
      <View style={[styles.border, { width: size, height: size, borderRadius: size / 2, borderColor: colors.cardBorder }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  initialsText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 1,
    right: 1,
    height: 3,
    opacity: 0.5,
  },
  border: {
    position: 'absolute',
    borderWidth: 1,
  }
});