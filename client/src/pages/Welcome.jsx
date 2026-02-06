import React from 'react';

export function Welcome({ onStartQuestionnaire }) {
  return (
    <main className="page page--welcome">
      <div className="welcome-card">
        <h1>Airules</h1>
        <p className="welcome-card__tagline">Generate AI agent rules for your project</p>
        <p className="welcome-card__desc">
          Answer a short questionnaire about your stack and preferences. We’ll generate a rules file
          for Cursor, Claude, or a generic format.
        </p>
        <button type="button" className="welcome-card__cta" onClick={onStartQuestionnaire}>
          Start questionnaire
        </button>
      </div>
    </main>
  );
}
