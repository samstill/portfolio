import { Theme } from '../types/theme';

export const darkTheme: Theme = {
  text: {
    primary: '#000000',
    secondary: '#1f1f1f'  // Darker, more visible color
  },
  textShadow: '0px 0px 1px rgba(255, 255, 255, 0.3)',  // Subtle text shadow for better readability
  skeleton: {
    start: 'rgba(255, 255, 255, 0.05)',
    middle: 'rgba(255, 255, 255, 0.1)',
    end: 'rgba(255, 255, 255, 0.05)'
  }
};

export const lightTheme: Theme = {
  text: {
    primary: '#1a1a1a',
    secondary: '#4a4a4a'
  },
  skeleton: {
    start: 'rgba(0, 0, 0, 0.05)',
    middle: 'rgba(0, 0, 0, 0.1)',
    end: 'rgba(0, 0, 0, 0.05)'
  }
};
