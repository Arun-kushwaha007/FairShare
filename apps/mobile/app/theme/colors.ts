/**
 * Royal SaaS Design System Palette
 * 
 * Philosophy:
 * - Base: Minimalism
 * - Depth: Skeuomorphic shadows and highlights
 * - Accent: 10% Brutalist contrast
 * - Tone: Royal SaaS (Purple + Gold)
 */

export const colors = {
  light: {
    // Brand Colors
    primary: '#6D28D9',       // Royal Purple
    primaryDark: '#4C1D95',   // Deep Royal Purple
    accent: '#F59E0B',        // Royal Gold
    accentSoft: '#FCD34D',    // Soft Gold
    success: '#22C55E',       // Emerald
    danger: '#EF4444',        // Crimson
    warning: '#F59E0B',       // Amber

    // Backgrounds
    background: '#F8F6F2',    // Main background
    surface: '#FFFFFF',       // Surface
    glass: 'rgba(255, 255, 255, 0.65)',
    
    // Cards
    card: '#FFFFFF',
    cardElevated: '#F3F0EA',
    cardBorder: 'rgba(0, 0, 0, 0.06)',

    // Text
    text_primary: '#1A1A1A',
    text_secondary: '#5B5B5B',
    muted: '#8A8A8A',

    // Buttons
    button_primary: '#6D28D9',
    button_primary_hover: '#5B21B6',
    button_secondary: '#FCD34D',

    // Borders
    border: '#E8E6E1',        // Soft border
    borderHard: '#111111',    // Brutalist accent

    // Shadows (Skeuomorphic)
    shadowSoft: 'rgba(0,0,0,0.06)',
    shadowElevated: 'rgba(0,0,0,0.12)',
    insetHighlight: 'rgba(255,255,255,0.6)',
    
    // Gradients
    gradient: ['#6D28D9', '#8B5CF6'],
  },
  dark: {
    // Brand Colors
    primary: '#8B5CF6',       // Royal Purple (Lightened for dark mode)
    primaryDark: '#7C3AED',
    accent: '#F59E0B',
    accentSoft: '#FCD34D',
    success: '#22C55E',
    danger: '#EF4444',
    warning: '#F59E0B',

    // Backgrounds
    background: '#0E0E11',    // Main background
    surface: '#141418',       // Secondary background
    glass: 'rgba(255, 255, 255, 0.06)',

    // Cards
    card: '#1B1B22',          // Primary card
    cardElevated: '#23232B',  // Elevated card
    cardBorder: 'rgba(255, 255, 255, 0.08)',

    // Text
    text_primary: '#F5F5F7',
    text_secondary: '#A1A1AA',
    muted: '#6B6B72',

    // Buttons
    button_primary: '#8B5CF6',
    button_primary_hover: '#7C3AED',
    button_secondary: '#FCD34D',

    // Borders
    border: 'rgba(255, 255, 255, 0.08)', // Soft border
    borderHard: '#FFFFFF',             // Brutalist accent

    // Shadows (Skeuomorphic)
    shadowSoft: 'rgba(0,0,0,0.5)',
    shadowElevated: 'rgba(0,0,0,0.7)',
    insetHighlight: 'rgba(255,255,255,0.05)',

    // Gradients
    gradient: ['#7C3AED', '#A78BFA'],
  },
};
