import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from './AuthContext';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
  isLoading: boolean;
}

const THEME_STORAGE_KEY = 'app_theme_preference';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [theme, setThemeState] = useState<Theme>(() => {
    // Initialize from localStorage or system preference
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Default to light mode if no preference is saved
    return 'light';
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference from Firebase when user logs in
  useEffect(() => {
    const loadTheme = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      try {
        const userSettingsRef = doc(db, 'userSettings', currentUser.uid);
        const userSettings = await getDoc(userSettingsRef);

        if (userSettings.exists()) {
          const data = userSettings.data();
          if (data.theme === 'dark' || data.theme === 'light') {
            setThemeState(data.theme);
            localStorage.setItem(THEME_STORAGE_KEY, data.theme);
          }
        } else {
          // If no settings exist, create default settings with current theme
          await setDoc(userSettingsRef, {
            theme,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [currentUser, theme]);

  // Function to update theme in state, localStorage, and Firebase
  const setTheme = async (newTheme: Theme) => {
    // Update localStorage immediately
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    setThemeState(newTheme);

    // Update Firebase if user is logged in
    if (currentUser) {
      try {
        const userSettingsRef = doc(db, 'userSettings', currentUser.uid);
        await setDoc(userSettingsRef, {
          theme: newTheme,
          updatedAt: new Date()
        }, { merge: true });
      } catch (error) {
        console.error('Error updating theme preference:', error);
        throw error;
      }
    }
  };

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
