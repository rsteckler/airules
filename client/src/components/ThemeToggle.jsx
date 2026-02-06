import React from 'react';
import { useTheme } from '../context/ThemeContext';

const icons = {
  light: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  ),
  dark: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  system: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      {(['light', 'dark', 'system']).map((value) => (
        <button
          key={value}
          type="button"
          className={`theme-toggle__btn ${theme === value ? 'theme-toggle__btn--active' : ''}`}
          onClick={() => setTheme(value)}
          title={value === 'light' ? 'Light' : value === 'dark' ? 'Dark' : 'System'}
          aria-label={value === 'light' ? 'Light mode' : value === 'dark' ? 'Dark mode' : 'Use system setting'}
          aria-pressed={theme === value}
        >
          {icons[value]}
        </button>
      ))}
    </div>
  );
}
