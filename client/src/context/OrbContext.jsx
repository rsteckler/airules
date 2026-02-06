import React, { createContext, useContext, useRef } from 'react';

const OrbContext = createContext(null);

export function OrbProvider({ children }) {
  const orbRef = useRef(null);

  return (
    <OrbContext.Provider value={{ orbRef }}>
      {children}
    </OrbContext.Provider>
  );
}

export function useOrb() {
  const context = useContext(OrbContext);
  if (!context) {
    throw new Error('useOrb must be used within an OrbProvider');
  }
  return context.orbRef;
}
