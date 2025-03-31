import React, { createContext, useContext, useState } from 'react';
import { MessengerContextType, ThemeMode } from '../types';

const MessengerContext = createContext<MessengerContextType | undefined>(undefined);

export const MessengerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const updateOtherUserName = (name: string, photoURL?: string, isOnline?: boolean, email?: string) => {
    // This will be implemented by the MessengerScreen component
    return {
      name,
      photoURL: photoURL || null,
      initial: email ? email.split('@')[0].charAt(0).toUpperCase() : 
                name ? name.charAt(0).toUpperCase() : '',
      isOnline: isOnline || false
    };
  };

  return (
    <MessengerContext.Provider value={{ theme, toggleTheme, updateOtherUserName }}>
      {children}
    </MessengerContext.Provider>
  );
};

export const useMessenger = () => {
  const context = useContext(MessengerContext);
  if (context === undefined) {
    throw new Error('useMessenger must be used within a MessengerProvider');
  }
  return context;
}; 