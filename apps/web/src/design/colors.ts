// Royal SaaS palette shared across light/dark themes.
export const palette = {
  royalPurple: '#6D28D9',
  royalPurpleDeep: '#5B21B6',
  royalPurpleBright: '#8B5CF6',
  softGold: '#FCD34D',
  warmGold: '#F59E0B',
  royalGold: '#AF8E3B',
  royalGoldHover: '#947731',
  champagne: '#F9F7F2',
  alabaster: '#F8F6F2',
  porcelain: '#FFFFFF',
  obsidian: '#0E0E11',
  graphite: '#1B1B22',
  ink: '#111111',
  onyx: '#0F1115',
  snow: '#F5F5F7',
  slate: '#A1A1AA',
  pewter: '#8A8A8A',
  ash: '#5B5B5B',
  charcoal: '#4B4B4B',
  mint: '#22C55E',
  coral: '#EF4444',
  amber: '#F59E0B',
};

export type ColorMode = 'light' | 'dark';

export const colors: Record<ColorMode, {
  background: string;
  surface: string;
  card: string;
  cardSolid: string;
  primary: string;
  primaryHover: string;
  accent: string;
  accentSoft: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderSoft: string;
  borderHard: string;
  glass: string;
  shadowSoft: string;
  shadowElevated: string;
  success: string;
  danger: string;
  warning: string;
}> = {
  light: {
    background: palette.champagne,
    surface: palette.porcelain,
    card: 'rgba(255, 255, 255, 0.7)',
    cardSolid: palette.porcelain,
    primary: palette.royalPurple,
    primaryHover: palette.royalPurpleDeep,
    accent: palette.royalGold,
    accentSoft: '#F3EFE4',
    textPrimary: palette.onyx,
    textSecondary: palette.charcoal,
    textMuted: palette.ash,
    borderSoft: '#E5E0D5',
    borderHard: palette.royalGold,
    glass: 'rgba(255, 255, 255, 0.75)',
    shadowSoft: '0px 10px 40px rgba(111, 40, 217, 0.04)',
    shadowElevated: '0px 20px 60px rgba(0,0,0,0.06)',
    success: palette.mint,
    danger: palette.coral,
    warning: palette.warmGold,
  },
  dark: {
    background: palette.obsidian,
    surface: palette.graphite,
    card: 'rgba(255, 255, 255, 0.05)',
    cardSolid: '#1E1E26',
    primary: palette.royalPurpleBright,
    primaryHover: '#7C3AED',
    accent: palette.softGold,
    accentSoft: '#FDE68A',
    textPrimary: palette.snow,
    textSecondary: palette.slate,
    textMuted: '#6B6B72',
    borderSoft: 'rgba(255, 255, 255, 0.08)',
    borderHard: '#FFFFFF',
    glass: 'rgba(255, 255, 255, 0.06)',
    shadowSoft: '0px 12px 36px rgba(0,0,0,0.45)',
    shadowElevated: '0px 22px 70px rgba(0,0,0,0.6)',
    success: palette.mint,
    danger: palette.coral,
    warning: palette.warmGold,
  },
};

export type ColorTokens = typeof colors;
