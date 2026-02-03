import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 'matrix' | 'windows11' | 'windows11-dark';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('fbg-theme');
    return (saved as ThemeMode) || 'matrix';
  });

  useEffect(() => {
    localStorage.setItem('fbg-theme', theme);
    
    // Apply theme to document root
    const root = document.documentElement;
    root.classList.remove('theme-matrix', 'theme-windows11', 'theme-windows11-dark');
    
    if (theme === 'matrix') {
      root.classList.add('theme-matrix');
    } else if (theme === 'windows11') {
      root.classList.add('theme-windows11');
    } else {
      root.classList.add('theme-windows11-dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
