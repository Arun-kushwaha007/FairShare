import React from 'react';
import { List } from 'react-native-paper';

export function ListItem({
  title,
  description,
  onPress,
}: {
  title: string;
  description?: string;
  onPress?: () => void;
}) {
  return <List.Item title={title} description={description} onPress={onPress} />;
}
