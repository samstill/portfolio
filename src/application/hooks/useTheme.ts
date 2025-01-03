import { useState, useEffect } from 'react';
import type { Theme } from '@/domain/theme/theme.types';
import { THEME_MODES } from '@/domain/theme/theme.constants';
import { lightTheme, darkTheme, monochromaticTheme } from '@/infrastructure/theme/theme.config';

const THEME_STORAGE_KEY = 'app-theme';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      return JSON.parse(savedTheme);
    }
    return lightTheme;
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev.mode === THEME_MODES.LIGHT 
        ? darkTheme 
        : prev.mode === THEME_MODES.DARK 
          ? monochromaticTheme 
          : lightTheme;
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newTheme));
      return newTheme;
    });
  };

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      setTheme(prefersDark ? darkTheme : lightTheme);
    }
  }, []);

  return { theme, toggleTheme };
};
