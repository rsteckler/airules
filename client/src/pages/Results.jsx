import React, { useState, useEffect, useCallback } from 'react';
import { useQuestionnaire } from '../context/QuestionnaireContext';
import { generateRules } from '../api/client';

const RESULTS_STEP_ID = 'results';

export function ResultsCard({ onBackToQuestionnaire, flowData, skipped, traversalOrder }) {
  const { answers } = useQuestionnaire();

  const [rulesContent, setRulesContent] = useState('');
  const [filename, setFilename] = useState('rules.md');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate rules when the component mounts or answers change
  const generate = useCallback(async () => {
    if (!answers || Object.keys(answers).length === 0) return;

    setLoading(true);
    setError(null);
    try {
      const result = await generateRules({ answers });
      setRulesContent(result.content || '');
      setFilename(result.filename || 'rules.md');
    } catch (err) {
      console.error('Failed to generate rules:', err);
      setError(err?.body?.error || err?.message || 'Failed to generate rules');
    } finally {
      setLoading(false);
    }
  }, [answers]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleCopy = () => {
    if (rulesContent) {
      navigator.clipboard?.writeText?.(rulesContent).catch(() => {});
    }
  };

  const handleDownload = () => {
    const text = rulesContent || 'No rules generated.';
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="results-card">
      <h2>Your AI Rules</h2>
      <div className="results-content">
        {loading && (
          <p className="results-loading">Generating rules...</p>
        )}
        {error && (
          <div className="results-error">
            <p>Error: {error}</p>
            <button type="button" onClick={generate}>Retry</button>
          </div>
        )}
        {!loading && !error && rulesContent && (
          <pre className="results-pre">{rulesContent}</pre>
        )}
        {!loading && !error && !rulesContent && (
          <p>No answers recorded. Complete the questionnaire to see results.</p>
        )}
      </div>
      <div className="results-actions">
        <button type="button" className="results-actions__copy" onClick={handleCopy} disabled={!rulesContent || loading}>
          Copy
        </button>
        <button type="button" className="results-actions__download" onClick={handleDownload} disabled={!rulesContent || loading}>
          Download
        </button>
      </div>
      <p className="results-instructions">
        Copy the content above (or the downloaded file) to <code>.cursorrules</code> (Cursor) or <code>CLAUDE.md</code> (Claude Code) in the root of your project.
      </p>
      <button type="button" className="results-back" onClick={onBackToQuestionnaire}>
        Start Over
      </button>
    </div>
  );
}

export { RESULTS_STEP_ID };

export function Results({ onBackToQuestionnaire, flowData, skipped, traversalOrder }) {
  return (
    <main className="page page--results">
      <ResultsCard
        onBackToQuestionnaire={onBackToQuestionnaire}
        flowData={flowData}
        skipped={skipped}
        traversalOrder={traversalOrder}
      />
    </main>
  );
}
