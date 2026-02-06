import React, { useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useOrb } from '../context/OrbContext';
import { Orb } from './orb';

const headerOrbConfig = { size: 100 };

export function SiteHeader() {
  const orbRef = useOrb();

  useEffect(() => {
    orbRef.current?.randomize?.();
  }, [orbRef]);

  const handleOrbClick = () => {
    orbRef.current?.randomize?.();
  };

  return (
    <header className="site-header">
      <div
        className="site-header__orb site-header__orb--left"
        role="button"
        tabIndex={0}
        aria-label="Randomize orb"
        onClick={handleOrbClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOrbClick(); } }}
      >
        <Orb ref={orbRef} initialConfig={headerOrbConfig} />
      </div>
      <nav className="site-header__nav" aria-label="Main">
        <span className="site-header__tagline">AI Rules Generator</span>
      </nav>
      <div className="site-header__actions">
        <ThemeToggle />
      </div>
    </header>
  );
}
