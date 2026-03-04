import React from 'react';
import { Text } from 'react-native-paper';

export function MoneyText({ cents }: { cents: string }) {
  const amount = Number(cents) / 100;
  return <Text variant="titleMedium">${amount.toFixed(2)}</Text>;
}
