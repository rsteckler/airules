import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'airules_theme';

/** @type {'light' | 'dark' | 'system'} */
function getStored() {
  if (typeof window === 'undefined') return 'system';
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === 'light' || v === 'dark' || v === 'system') return v;
  return 'system';
}

function getEffectiveTheme(theme) {
  if (theme === 'light' || theme === 'dark') return theme;
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStored);
  const [effective, setEffective] = useState(() => getEffectiveTheme(getStored()));

  useEffect(() => {
    const effectiveTheme = getEffectiveTheme(theme);
    setEffective(effectiveTheme);
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const next = mq.matches ? 'dark' : 'light';
      setEffective(next);
      document.documentElement.setAttribute('data-theme', next);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);

  const setTheme = (value) => {
    setThemeState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, value);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effective }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
