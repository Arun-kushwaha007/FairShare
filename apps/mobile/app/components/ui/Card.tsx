import React from 'react';
import { Card as PaperCard, CardProps } from 'react-native-paper';

export function Card(props: CardProps) {
  return <PaperCard mode="contained" {...props} />;
}
