import React from 'react';
import { Avatar as PaperAvatar } from 'react-native-paper';

export function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (avatarUrl) {
    return <PaperAvatar.Image size={36} source={{ uri: avatarUrl }} />;
  }

  return <PaperAvatar.Text size={36} label={initials} />;
}