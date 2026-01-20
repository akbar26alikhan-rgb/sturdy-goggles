'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'stock-dashboard-theme'
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>('light');
  const [mounted, setMounted] = useState(false);

  // Get system theme preference
  const getSystemTheme = (): 'dark' | 'light' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Calculate the actual theme to use
  const calculateActualTheme = (currentTheme: Theme): 'dark' | 'light' => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  };

  // Update document class and actual theme
  const updateTheme = (newTheme: Theme) => {
    const calculatedTheme = calculateActualTheme(newTheme);
    
    // Update document class
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(calculatedTheme);
    
    // Update actual theme state
    setActualTheme(calculatedTheme);
    
    // Store theme preference
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(storageKey) as Theme;
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }
    
    setMounted(true);
  }, [storageKey]);

  // Update theme when theme state changes
  useEffect(() => {
    if (!mounted) return;
    
    const calculatedTheme = calculateActualTheme(theme);
    
    // Update document class
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(calculatedTheme);
    
    // Update actual theme state
    setActualTheme(calculatedTheme);
    
    // Store theme preference
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, [theme, mounted, storageKey]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const newTheme = calculateActualTheme('system');
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(newTheme);
        setActualTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  // Set initial document class to prevent flash
  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    root.classList.add('light'); // Default to light to prevent flash
    
    // Then set the correct theme
    setTimeout(() => {
      const calculatedTheme = calculateActualTheme(theme);
      root.classList.remove('light', 'dark');
      root.classList.add(calculatedTheme);
      setActualTheme(calculatedTheme);
    }, 0);
  }, [mounted, theme, calculateActualTheme]);

  const value: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    isDark: actualTheme === 'dark'
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook for checking if dark mode is active (synced with system)
export const useDarkMode = (): boolean => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      if (typeof window === 'undefined') return;
      
      const savedTheme = localStorage.getItem('stock-dashboard-theme') as Theme;
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const shouldUseDark = savedTheme === 'dark' || (savedTheme === 'system' && systemPrefersDark);
      setIsDark(shouldUseDark);
      setMounted(true);
    };

    checkDarkMode();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => checkDarkMode();

    mediaQuery.addEventListener('change', handleChange);
    
    // Listen for theme changes in localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'stock-dashboard-theme') {
        checkDarkMode();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return false;
  }

  return isDark;
};

// Theme toggle component helper
export const getThemeClasses = (isDark: boolean) => ({
  background: isDark ? 'bg-gray-900' : 'bg-white',
  text: isDark ? 'text-white' : 'text-gray-900',
  textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
  textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
  border: isDark ? 'border-gray-700' : 'border-gray-200',
  borderHover: isDark ? 'hover:border-gray-600' : 'hover:border-gray-300',
  card: isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
  cardHover: isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50',
  input: isDark 
    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
  button: isDark 
    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
    : 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  buttonPrimary: isDark 
    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
    : 'bg-blue-600 hover:bg-blue-700 text-white',
  success: isDark ? 'text-green-400' : 'text-green-600',
  danger: isDark ? 'text-red-400' : 'text-red-600',
  warning: isDark ? 'text-yellow-400' : 'text-yellow-600',
});