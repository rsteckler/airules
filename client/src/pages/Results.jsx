import React from 'react';

export function Results({ onBackToQuestionnaire }) {

  const handleCopy = () => {
    // Non-functional for Phase 2; Phase 4 will wire to real content
    navigator.clipboard?.writeText?.('').catch(() => {});
  };

  const handleDownload = () => {
    // Non-functional for Phase 2; Phase 4 will wire to real content and filename
    const blob = new Blob([''], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'rules.md';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <main className="page page--results">
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
          Back to questionnaire
        </button>
      </div>
    </main>
  );
}
