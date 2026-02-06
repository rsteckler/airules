import React from 'react';

const RESULTS_STEP_ID = 'results';

export function ResultsCard({ onBackToQuestionnaire }) {
  const handleCopy = () => {
    navigator.clipboard?.writeText?.('').catch(() => {});
  };

  const handleDownload = () => {
    const blob = new Blob([''], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'rules.md';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="results-card">
      <h1>Your rules</h1>
      <div className="results-placeholder">
        <p>Your rules will appear here.</p>
        <p className="results-placeholder__hint">Complete the questionnaire and generate rules in a later phase.</p>
      </div>
      <div className="results-actions">
        <button type="button" className="results-actions__copy" onClick={handleCopy}>
          Copy
        </button>
        <button type="button" className="results-actions__download" onClick={handleDownload}>
          Download
        </button>
      </div>
      <button type="button" className="results-back" onClick={onBackToQuestionnaire}>
        Start Over
      </button>
    </div>
  );
}

export { RESULTS_STEP_ID };

export function Results({ onBackToQuestionnaire }) {
  return (
    <main className="page page--results">
      <ResultsCard onBackToQuestionnaire={onBackToQuestionnaire} />
    </main>
  );
}
