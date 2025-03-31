import { useState } from 'react';

export type ThemeMode = 'light' | 'dark';

// Theme definitions
export const themeColors = {
  light: {
    background: 'rgba(255, 255, 255, 0.6)',
    backgroundSecondary: 'rgba(255, 255, 255, 0.3)',
    text: '#1a1b25',
    textSecondary: '#666',
    primary: '#4a6cf7',
    border: 'rgba(225, 228, 232, 0.4)',
    shadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
    cardShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    bubbleMine: 'rgba(74, 108, 247, 0.9)',
    bubbleOther: 'rgba(255, 255, 255, 0.8)',
    backgroundActive: 'rgba(74, 108, 247, 0.1)'
  },
  dark: {
    background: 'rgba(25, 28, 39, 0.8)',
    backgroundSecondary: 'rgba(32, 36, 48, 0.7)',
    text: '#e1e5ee',
    textSecondary: '#a8b0c5',
    primary: '#6e8efb',
    border: 'rgba(65, 70, 90, 0.6)',
    shadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    cardShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
    bubbleMine: 'rgba(74, 108, 247, 0.9)',
    bubbleOther: 'rgba(41, 45, 62, 0.9)',
    backgroundActive: 'rgba(74, 108, 247, 0.2)'
  }
};

export const useMessengerTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return { theme, toggleTheme, themeColors };
}; 