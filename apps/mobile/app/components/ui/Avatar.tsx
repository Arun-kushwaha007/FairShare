import React from 'react';
import { Avatar as PaperAvatar } from 'react-native-paper';

export function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return <PaperAvatar.Text size={36} label={initials} />;
}
