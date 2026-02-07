import React from 'react';
import { useQuestionnaire } from '../context/QuestionnaireContext';
import { companionFieldName, hasOtherOption, hasNoneOption } from '../engine/traversal.js';

const OTHER_VALUE = 'other';

/**
 * Renders a single question step driven by the flow JSON.
 *
 * @param {{ nodeData: object, optionsList: Array, validationError: string|null }} props
 *   nodeData  – node.data from the flow JSON (questionId, label, control, etc.)
 *   optionsList – options array from flowData.options[questionId]
 *   validationError – error message to display (from per-node validation)
 */
export function FlowQuestionStep({ nodeData, optionsList, validationError, onSkip, canSkip }) {
  const { answers, dispatch } = useQuestionnaire();

  const { questionId, label, control } = nodeData;
  const value = answers[questionId];
  const companionKey = companionFieldName(questionId);
  const companionValue = answers[companionKey] ?? '';

  const isMulti = control === 'multi';
  const isSingle = control === 'single';

  // Separate "other" from normal options for rendering
  const otherOpt = optionsList?.find((o) => o.type === 'other');
  const normalOptions = (optionsList ?? []).filter((o) => o.type !== 'other');
  const noneExclusive = hasNoneOption(optionsList);

  const showOtherInput =
    otherOpt &&
    (isMulti
      ? Array.isArray(value) && value.includes(OTHER_VALUE)
      : value === OTHER_VALUE);

  // Highlight the companion field when "other" is selected but empty
  const otherTextMissing = showOtherInput && (!companionValue || companionValue.trim() === '');

  const setAnswer = (v) =>
    dispatch({ type: 'SET_ANSWER', payload: { fieldId: questionId, value: v } });
  const setCompanion = (v) =>
    dispatch({ type: 'SET_ANSWER', payload: { fieldId: companionKey, value: v } });

  const handleSingle = (optionValue) => {
    setAnswer(optionValue);
    if (optionValue !== OTHER_VALUE) setCompanion('');
  };

  const handleMulti = (optionValue) => {
    let next = Array.isArray(value) ? [...value] : [];
    const noneOpt = noneExclusive && normalOptions.find((o) => o.type === 'none');
    const noneVal = noneOpt?.value;

    if (noneVal && optionValue === noneVal) {
      // Selecting "none" clears everything else
      next = [noneVal];
    } else if (noneVal && next.includes(noneVal)) {
      // Selecting something else clears "none"
      next = next.filter((x) => x !== noneVal);
      if (!next.includes(optionValue)) next.push(optionValue);
    } else {
      const idx = next.indexOf(optionValue);
      if (idx >= 0) next.splice(idx, 1);
      else next.push(optionValue);
    }

    setAnswer(next);
    if (!next.includes(OTHER_VALUE)) setCompanion('');
  };

  return (
    <div className="question-step">
      <div className="question-step__header">
        <h2 className="question-step__title">{label}</h2>
        {canSkip && onSkip && (
          <button type="button" className="question-step__skip-btn" onClick={onSkip}>
            Skip
          </button>
        )}
      </div>

      {isSingle && (
        <div className="question-step__options question-step__options--single">
          {normalOptions.map((opt) => (
            <label key={opt.value} className="question-step__option">
              <input
                type="radio"
                name={questionId}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => handleSingle(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
          {otherOpt && (
            <label className="question-step__option">
              <input
                type="radio"
                name={questionId}
                value={OTHER_VALUE}
                checked={value === OTHER_VALUE}
                onChange={() => handleSingle(OTHER_VALUE)}
              />
              <span>{otherOpt.label}</span>
            </label>
          )}
        </div>
      )}

      {isMulti && (
        <div className="question-step__options question-step__options--multi">
          {normalOptions.map((opt) => (
            <label key={opt.value} className="question-step__option">
              <input
                type="checkbox"
                value={opt.value}
                checked={Array.isArray(value) && value.includes(opt.value)}
                onChange={() => handleMulti(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
          {otherOpt && (
            <label className="question-step__option">
              <input
                type="checkbox"
                value={OTHER_VALUE}
                checked={Array.isArray(value) && value.includes(OTHER_VALUE)}
                onChange={() => handleMulti(OTHER_VALUE)}
              />
              <span>{otherOpt.label}</span>
            </label>
          )}
        </div>
      )}

      {showOtherInput && (
        <div className="question-step__other question-step__other--open">
          <label className="question-step__other-label">Please specify</label>
          <input
            type="text"
            className={`question-step__other-input${otherTextMissing ? ' question-step__other-input--error' : ''}`}
            value={companionValue}
            onChange={(e) => setCompanion(e.target.value)}
            placeholder="Describe…"
          />
          {otherTextMissing && (
            <span className="question-step__other-error" role="alert">
              Required — please describe your choice.
            </span>
          )}
        </div>
      )}

      {validationError && (
        <span className="question-step__other-error" role="alert">
          {validationError}
        </span>
      )}
    </div>
  );
}
