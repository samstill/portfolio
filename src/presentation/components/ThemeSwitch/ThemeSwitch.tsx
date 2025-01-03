'use client';

import { FC } from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
import { useThemeContext } from '@/application/providers/ThemeProvider';
import { THEME_MODES } from '@/domain/theme/theme.constants';

export const ThemeSwitch: FC = () => {
  const { theme, toggleTheme } = useThemeContext();

  const getIcon = () => {
    switch (theme.mode) {
      case THEME_MODES.LIGHT:
        return <Sun className="w-5 h-5" />;
      case THEME_MODES.DARK:
        return <Moon className="w-5 h-5" />;
      case THEME_MODES.MONOCHROMATIC:
        return <Palette className="w-5 h-5" />;
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 
                 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label={`Switch to ${
        theme.mode === THEME_MODES.LIGHT 
          ? 'dark' 
          : theme.mode === THEME_MODES.DARK 
            ? 'monochromatic' 
            : 'light'
      } theme`}
    >
      {getIcon()}
    </button>
  );
};
