import React from 'react';
import { questionsById } from '../data/questions';
import { useQuestionnaire } from '../context/QuestionnaireContext';

const OTHER_VALUE = 'other';

function getAnswerValue(answers, questionId) {
  const q = questionsById[questionId];
  if (!q) return null;
  if (q.type === 'yesno') return answers[questionId]?.yes ?? null;
  return answers[questionId] ?? (q.type === 'multi' ? [] : null);
}

function isOtherSelected(questionId, answers, value) {
  if (questionsById[questionId].type === 'single') return value === OTHER_VALUE;
  return Array.isArray(value) && value.includes(OTHER_VALUE);
}

export function QuestionStep({ questionId }) {
  const { answers, dispatch } = useQuestionnaire();
  const question = questionsById[questionId];
  if (!question) return null;

  const value = getAnswerValue(answers, questionId);
  const otherText = answers.otherFields?.[questionId] ?? '';
  const tellMeMoreText = answers.tellMeMore?.[questionId] ?? '';
  const showOther = question.otherOption && isOtherSelected(questionId, answers, value);

  const setAnswer = (v) => dispatch({ type: 'SET_ANSWER', payload: { questionId, value: v } });
  const setOther = (text) => dispatch({ type: 'SET_OTHER', payload: { questionId, text } });
  const setTellMeMore = (text) => dispatch({ type: 'SET_TELL_ME_MORE', payload: { questionId, text } });

  const handleSingle = (optionValue) => setAnswer(optionValue);
  const handleMulti = (optionValue) => {
    const arr = Array.isArray(value) ? [...value] : [];
    const idx = arr.indexOf(optionValue);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(optionValue);
    setAnswer(arr);
  };
  const handleYesNo = (yes) => {
    const current = answers[questionId] ?? { yes: null, path: '' };
    setAnswer({ ...current, yes, path: current.path ?? '' });
  };
  const handlePath = (path) => {
    const current = answers[questionId] ?? { yes: null, path: '' };
    setAnswer({ ...current, path });
  };

  return (
    <div className="question-step">
      <h2 className="question-step__title">{question.label}</h2>

      {question.type === 'single' && (
        <div className="question-step__options question-step__options--single">
          {question.options.map((opt) => (
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
          {question.otherOption && (
            <label className="question-step__option">
              <input
                type="radio"
                name={questionId}
                value={OTHER_VALUE}
                checked={value === OTHER_VALUE}
                onChange={() => handleSingle(OTHER_VALUE)}
              />
              <span>Other</span>
            </label>
          )}
        </div>
      )}

      {question.type === 'multi' && (
        <div className="question-step__options question-step__options--multi">
          {question.options.map((opt) => (
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
          {question.otherOption && (
            <label className="question-step__option">
              <input
                type="checkbox"
                value={OTHER_VALUE}
                checked={Array.isArray(value) && value.includes(OTHER_VALUE)}
                onChange={() => handleMulti(OTHER_VALUE)}
              />
              <span>Other</span>
            </label>
          )}
        </div>
      )}

      {question.type === 'yesno' && (
        <div className="question-step__yesno">
          <label className="question-step__option">
            <input
              type="radio"
              name={questionId}
              checked={value === true}
              onChange={() => handleYesNo(true)}
            />
            <span>Yes</span>
          </label>
          <label className="question-step__option">
            <input
              type="radio"
              name={questionId}
              checked={value === false}
              onChange={() => handleYesNo(false)}
            />
            <span>No</span>
          </label>
          {(value === true || value === false) && question.optionalPath && (
            <div className="question-step__path">
              <label>
                {question.pathLabel}
                <input
                  type="text"
                  placeholder={question.pathPlaceholder}
                  value={answers[questionId]?.path ?? ''}
                  onChange={(e) => handlePath(e.target.value)}
                />
              </label>
            </div>
          )}
        </div>
      )}

      {showOther && (
        <div className="question-step__other">
          <label>
            Please specify:
            <input
              type="text"
              value={otherText}
              onChange={(e) => setOther(e.target.value)}
              placeholder="Describe your choice..."
            />
          </label>
        </div>
      )}

      {question.tellMeMore && (
        <div className="question-step__tell-me-more">
          <label>
            Tell me more (optional):
            <textarea
              value={tellMeMoreText}
              onChange={(e) => setTellMeMore(e.target.value)}
              placeholder="Any extra context for this question..."
              rows={3}
            />
          </label>
        </div>
      )}
    </div>
  );
}
