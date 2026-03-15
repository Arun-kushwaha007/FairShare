import { TextStyle } from 'react-native';

const fontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

export const typography = {
  fontFamily,
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
  },
  // Professional Royal SaaS variants
  // Headers are NOT all caps anymore per user preference, but we might 
  // use ALL CAPS for very small labels/badges if they still fit the 10% brutalist rule.
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: fontFamily.bold,
  } as TextStyle,
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: fontFamily.bold,
  } as TextStyle,
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: fontFamily.semiBold,
  } as TextStyle,
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamily.regular,
  } as TextStyle,
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamily.regular,
  } as TextStyle,
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamily.medium,
    // Accent rule: maybe uppercase for labels
    textTransform: 'uppercase',
    letterSpacing: 1,
  } as TextStyle,
};
