import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVisibleQuestionIds } from '../data/questions';
import { useQuestionnaire } from '../context/QuestionnaireContext';
import { StepIndicator } from '../components/StepIndicator';
import { QuestionStep } from '../components/QuestionStep';

export function Questionnaire() {
  const navigate = useNavigate();
  const { answers } = useQuestionnaire();
  const visibleIds = useMemo(() => getVisibleQuestionIds(answers), [answers]);
  const [stepIndex, setStepIndex] = useState(0);

  // If visible steps shrink (e.g. user went back and changed project type), clamp step index
  useEffect(() => {
    if (stepIndex >= visibleIds.length && visibleIds.length > 0) {
      setStepIndex(visibleIds.length - 1);
    }
  }, [visibleIds.length, stepIndex]);

  const questionId = visibleIds[stepIndex] ?? null;
  const totalSteps = visibleIds.length;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  const goBack = () => {
    if (isFirst) navigate('/');
    else setStepIndex((i) => i - 1);
  };

  const goNext = () => {
    if (isLast) navigate('/results');
    else setStepIndex((i) => i + 1);
  };

  if (totalSteps === 0) {
    return (
      <main className="page page--questionnaire">
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main className="page page--questionnaire">
      <StepIndicator currentStep={stepIndex} totalSteps={totalSteps} />
      <QuestionStep questionId={questionId} />
      <div className="questionnaire-nav">
        <button type="button" className="questionnaire-nav__back" onClick={goBack}>
          {isFirst ? 'Back to start' : 'Back'}
        </button>
        <button type="button" className="questionnaire-nav__next" onClick={goNext}>
          {isLast ? 'Generate rules' : 'Next'}
        </button>
      </div>
    </main>
  );
}
