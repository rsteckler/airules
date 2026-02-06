import React from 'react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      <label className="theme-toggle__label">
        <span className="theme-toggle__visually-hidden">Theme</span>
        <select
          className="theme-toggle__select"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          aria-label="Choose theme"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </label>
    </div>
  );
}
