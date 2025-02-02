import type { Theme } from '@/domain/theme/theme.types';
import { THEME_MODES, BREAKPOINTS } from '@/domain/theme/theme.constants';

export const lightTheme: Theme = {
  mode: THEME_MODES.LIGHT,
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E2E8F0'
  },
  breakpoints: BREAKPOINTS
};

export const darkTheme: Theme = {
  mode: THEME_MODES.DARK,
  colors: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#000000',
    text: '#FFFFFF',
    textSecondary: '#A0AEC0',
    border: '#2D3748'
  },
  breakpoints: BREAKPOINTS
};

export const monochromaticTheme: Theme = {
  mode: THEME_MODES.MONOCHROMATIC,
  colors: {
    primary: '#2B6CB0',    // Rich blue
    secondary: '#4299E1',  // Medium blue
    background: '#EBF8FF', // Very light blue
    text: '#1A365D',       // Dark blue
    textSecondary: '#2C5282',
    border: '#BEE3F8'
  },
  breakpoints: BREAKPOINTS
};
