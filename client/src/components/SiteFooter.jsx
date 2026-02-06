import React from 'react';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__copy">
          © {year} Airules. Generate AI agent rules for Cursor, Claude, and more.
        </p>
      </div>
    </footer>
  );
}
