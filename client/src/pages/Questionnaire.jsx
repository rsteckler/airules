import React, { useMemo, useState, useEffect, useRef } from 'react';
import { getVisibleQuestionIds } from '../data/questions';
import { useQuestionnaire } from '../context/QuestionnaireContext';
import { StepIndicator } from '../components/StepIndicator';
import { QuestionStep } from '../components/QuestionStep';
import { createSession, getSession, updateSession } from '../api/client';

export function Questionnaire({ onBackToStart, onShowResults, initialStepIndex = 0 }) {
  const { answers, dispatch, sessionId, setSessionId } = useQuestionnaire();
  const visibleIds = useMemo(() => getVisibleQuestionIds(answers), [answers]);
  const [stepIndex, setStepIndex] = useState(initialStepIndex);
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

  const totalSteps = visibleIds.length;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;
  const stackContainerRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);
  const [returnedFromBack, setReturnedFromBack] = useState(false);
  const exitTimeoutRef = useRef(null);

  // Expose stack height as CSS var so slots fill the view
  useEffect(() => {
    const el = stackContainerRef.current;
    if (!el) return;
    const setHeight = () => {
      el.style.setProperty('--questionnaire-scroll-height', `${el.clientHeight}px`);
    };
    setHeight();
    const ro = new ResizeObserver(setHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => () => {
    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
  }, []);

  // Only show current + past (stack builds up; no scrolling)
  const stackIds = visibleIds.slice(0, stepIndex + 1);

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
    if (isExiting) return;
    setIsExiting(true);
    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
    exitTimeoutRef.current = setTimeout(() => {
      setStepIndex((i) => i - 1);
      setIsExiting(false);
      setReturnedFromBack(true);
      exitTimeoutRef.current = null;
    }, 320);
  };

  const goNext = () => {
    setReturnedFromBack(false);
    if (isLast) {
      persistAnswers();
      onShowResults();
      return;
    }
    persistAnswers();
    setStepIndex((i) => i + 1);
  };

  const handleSkip = () => {
    setReturnedFromBack(false);
    persistAnswers();
    if (isLast) {
      onShowResults();
      return;
    }
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
      <div className="questionnaire-stack" ref={stackContainerRef} role="region" aria-label="Questions">
        <div className="questionnaire-steps">
          {stackIds.map((id, i) => (
            <div
              key={id}
              className={`questionnaire-step-slot${i < stepIndex ? ' questionnaire-step-slot--past' : ''}${i === stepIndex && isExiting ? ' questionnaire-step-slot--exiting' : ''}${i === stepIndex && returnedFromBack ? ' questionnaire-step-slot--returned-from-back' : ''}`}
              style={{
                zIndex: i,
                '--stack-offset': isExiting ? Math.max(0, stepIndex - 1 - i) : stepIndex - i,
              }}
              aria-hidden={i !== stepIndex}
            >
              {i === 0 && (
                <div className="questionnaire-intro-wrap">
                  <p className="questionnaire-intro">
                    Get better results from your coding agent by creating a rules file that ensures the agent
                    follows best practices tailored to your repository, the stack you use, and your own
                    developer preferences.
                  </p>
                </div>
              )}
              <QuestionStep questionId={id} onSkip={handleSkip} skipInNav />
            </div>
          ))}
        </div>
      </div>
      <div className="questionnaire-nav">
        <button
          type="button"
          className="questionnaire-nav__back"
          onClick={goBack}
          aria-label={isFirst ? 'Back to start' : 'Back'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="questionnaire-nav__center">
          {handleSkip && (
            <button type="button" className="questionnaire-nav__skip" onClick={handleSkip}>
              Skip this question
            </button>
          )}
        </div>
        <button
          type="button"
          className="questionnaire-nav__next"
          onClick={goNext}
          aria-label={isLast ? 'Generate rules' : 'Next'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </main>
  );
}
