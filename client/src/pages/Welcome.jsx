import React from 'react';

export function Welcome({ onStartQuestionnaire }) {
  return (
    <main className="page page--welcome">
      <div className="welcome-intro-wrap">
        <p className="welcome-intro">
          Get better results from your coding agent by creating a rules file that ensures the agent
          follows best practices tailored to your repository, the stack you use, and your own
          developer preferences.
        </p>
      </div>
      <div className="welcome-card">
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
