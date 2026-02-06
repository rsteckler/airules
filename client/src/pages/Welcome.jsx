import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <main className="page page--welcome">
      <div className="welcome-card">
        <h1>Airules</h1>
        <p className="welcome-card__tagline">Generate AI agent rules for your project</p>
        <p className="welcome-card__desc">
          Answer a short questionnaire about your stack and preferences. We’ll generate a rules file
          for Cursor, Claude, or a generic format.
        </p>
        <button type="button" className="welcome-card__cta" onClick={() => navigate('/questionnaire')}>
          Start questionnaire
        </button>
      </div>
    </main>
  );
}
