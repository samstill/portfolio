import { THEME_MODES } from './theme.constants';

export type ThemeMode = typeof THEME_MODES[keyof typeof THEME_MODES];

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}
