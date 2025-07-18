import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      return saved !== null ? JSON.parse(saved) : false;
    } catch (error) {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? {
      primary: 'from-gray-900 via-black to-gray-800',
      secondary: 'from-yellow-600 to-amber-500',
      accent: 'bg-yellow-500/20',
      text: 'text-yellow-100',
      textSecondary: 'text-yellow-200',
      textMuted: 'text-gray-400',
      border: 'border-yellow-500/30',
      input: 'bg-black border-yellow-500/30 border',
      card: 'bg-black/40 backdrop-blur-lg border-yellow-500/20',
      button: 'from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700',
      buttonSecondary: 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200',
      icon: 'text-yellow-400',
      success: 'bg-green-500/20 border-green-500/50 text-green-200',
      error: 'bg-red-500/20 border-red-500/50 text-red-200'
    } : {
      primary: '',
      secondary: '',
      accent: '',
      text: '',
      textSecondary: '',
      textMuted: '',
      border: '',
      input: '',
      card: '',
      button: '',
      buttonSecondary: '',
      icon: '',
      success: '',
      error: ''
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
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
