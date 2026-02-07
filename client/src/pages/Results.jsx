import React, { useMemo } from 'react';
import { useQuestionnaire } from '../context/QuestionnaireContext';
import { buildGraphMaps, companionFieldName } from '../engine/traversal.js';

const RESULTS_STEP_ID = 'results';

/**
 * Build a plain-text summary of questionnaire results.
 * Each answered (non-skipped) question is shown as:
 *   Question Label: Selected Option Label(s)
 */
function buildResultsText(flowData, traversalOrder, answers, skipped) {
  if (!flowData || !traversalOrder) return '';
  const maps = buildGraphMaps(flowData);
  const lines = [];

  for (const nodeId of traversalOrder) {
    const node = maps.nodesById.get(nodeId);
    if (!node) continue;

    const { questionId, label, control } = node.data;

    // Skip if question was skipped
    if (skipped?.has(questionId)) continue;

    const answer = answers[questionId];
    if (answer === undefined || answer === null) continue;

    const optionsList = flowData.options?.[questionId] ?? [];
    const optionLabelMap = new Map(optionsList.map((o) => [o.value, o.label]));

    let displayValue;
    if (control === 'multi' && Array.isArray(answer)) {
      displayValue = answer.map((v) => optionLabelMap.get(v) || v).join(', ');
    } else {
      displayValue = optionLabelMap.get(answer) || answer;
    }

    // Append companion "other" text if present
    const companionText = answers[companionFieldName(questionId)];
    if (companionText) {
      displayValue += ` (${companionText})`;
    }

    lines.push(`${label}: ${displayValue}`);
  }

  return lines.join('\n');
}

export function ResultsCard({ onBackToQuestionnaire, flowData, skipped, traversalOrder }) {
  const { answers } = useQuestionnaire();

  const resultsText = useMemo(
    () => buildResultsText(flowData, traversalOrder, answers, skipped),
    [flowData, traversalOrder, answers, skipped],
  );

  const handleCopy = () => {
    if (resultsText) {
      navigator.clipboard?.writeText?.(resultsText).catch(() => {});
    }
  };

  const handleDownload = () => {
    const text = resultsText || 'No answers recorded.';
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'questionnaire-results.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="results-card">
      <h2>Your results</h2>
      <div className="results-content">
        {resultsText ? (
          <pre className="results-pre">{resultsText}</pre>
        ) : (
          <p>No answers recorded. Complete the questionnaire to see results.</p>
        )}
      </div>
      <div className="results-actions">
        <button type="button" className="results-actions__copy" onClick={handleCopy} disabled={!resultsText}>
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
