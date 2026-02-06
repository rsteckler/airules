import React, { useMemo, useState, useEffect, useRef } from 'react';
import { getVisibleQuestionIds } from '../data/questions';
import { useQuestionnaire } from '../context/QuestionnaireContext';
import { StepIndicator } from '../components/StepIndicator';
import { QuestionStep } from '../components/QuestionStep';
import { createSession, getSession, updateSession } from '../api/client';

export function Questionnaire({ onBackToStart, onShowResults }) {
  const { answers, dispatch, sessionId, setSessionId } = useQuestionnaire();
  const visibleIds = useMemo(() => getVisibleQuestionIds(answers), [answers]);
  const [stepIndex, setStepIndex] = useState(0);
  const initDone = useRef(false);

  // Ensure we have a session: create or rehydrate from stored session id
  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    if (sessionId) {
      getSession(sessionId)
        .then((session) => {
          if (session.answers) dispatch({ type: 'RESTORE', payload: session.answers });
        })
        .catch(() => {
          setSessionId(null);
          initDone.current = false;
        });
      return;
    }

    createSession()
      .then(({ id }) => {
        setSessionId(id);
      })
      .catch(() => {
        initDone.current = false;
      });
  }, [sessionId, setSessionId, dispatch]);

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

  const persistAnswers = () => {
    if (!sessionId) return;
    updateSession(sessionId, { answers }).catch(() => {});
  };

  const goBack = () => {
    persistAnswers();
    if (isFirst) {
      onBackToStart();
      return;
    }
    setStepIndex((i) => i - 1);
  };

  const goNext = () => {
    if (isLast) {
      persistAnswers();
      onShowResults();
      return;
    }
    persistAnswers();
    setStepIndex((i) => i + 1);
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
