import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeMode = 
  | 'matrix' | 'windows11' | 'windows11-dark' | 'aero2010'
  | 'cyberpunk' | 'nord' | 'dracula' | 'solarized' | 'monokai'
  | 'rosepine' | 'sunset' | 'ocean' | 'forest' | 'retro';

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
    const root = document.documentElement;
    const allThemes = [
      'theme-matrix', 'theme-windows11', 'theme-windows11-dark', 'theme-aero2010',
      'theme-cyberpunk', 'theme-nord', 'theme-dracula', 'theme-solarized', 'theme-monokai',
      'theme-rosepine', 'theme-sunset', 'theme-ocean', 'theme-forest', 'theme-retro',
    ];
    root.classList.remove(...allThemes);
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
