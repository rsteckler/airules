import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useQuestionnaire } from '../context/QuestionnaireContext';
import { StepIndicator } from '../components/StepIndicator';
import { FlowQuestionStep } from '../components/FlowQuestionStep';
import { ResultsCard, RESULTS_STEP_ID } from './Results';
import { getQuestionnaireFlow, createSession, getSession, updateSession } from '../api/client';
import {
  buildGraphMaps,
  computeTraversalOrder,
  getFullReachableNodes,
  pruneAnswers,
  isNodeComplete,
} from '../engine/traversal.js';
import { validateNode } from '../engine/validator.js';
import { trackQuestionView, trackQuestionAnswer, trackQuestionSkip, trackResultsView } from '../analytics';

export function Questionnaire({ onBackToStart, initialStepIndex = 0 }) {
  const { answers, dispatch, sessionId, setSessionId, skipped, skipQuestion, unskipQuestion, resetSkipped } = useQuestionnaire();

  // Flow data from server
  const [flowData, setFlowData] = useState(null);
  const [flowError, setFlowError] = useState(null);

  // Navigation state
  const [stepIndex, setStepIndex] = useState(initialStepIndex);
  const [validationError, setValidationError] = useState(null);

  // Session init guard
  const initDone = useRef(false);

  // Animation state
  const stackContainerRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);
  const [returnedFromBack, setReturnedFromBack] = useState(false);
  const exitTimeoutRef = useRef(null);

  // ── Precomputed graph maps ──────────────────────────────────────
  const maps = useMemo(() => {
    if (!flowData) return null;
    return buildGraphMaps(flowData);
  }, [flowData]);

  // ── DFS traversal order ─────────────────────────────────────────
  const traversalOrder = useMemo(() => {
    if (!flowData || !maps) return [];
    return computeTraversalOrder(flowData.rootId, answers, flowData, maps, skipped);
  }, [flowData, maps, answers, skipped]);

  // Total steps = traversal nodes + 1 for results
  const totalSteps = traversalOrder.length + 1;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === traversalOrder.length; // results card
  const isOnLastQuestion = stepIndex === traversalOrder.length - 1;

  // Current node
  const currentNodeId = traversalOrder[stepIndex];
  const currentNode = currentNodeId ? maps?.nodesById.get(currentNodeId) : null;
  const currentNodeData = currentNode?.data;
  const currentOptions = currentNodeData
    ? (flowData?.options?.[currentNodeData.questionId] ?? [])
    : [];

  // Build stackIds for the card stack animation
  const stackIds = useMemo(() => {
    if (stepIndex < traversalOrder.length) {
      return traversalOrder.slice(0, stepIndex + 1);
    }
    return [...traversalOrder, RESULTS_STEP_ID];
  }, [traversalOrder, stepIndex]);

  // ── Fetch flow data ─────────────────────────────────────────────
  useEffect(() => {
    getQuestionnaireFlow()
      .then(setFlowData)
      .catch((err) => setFlowError(err?.message || 'Failed to load questionnaire'));
  }, []);

  // ── Session init ────────────────────────────────────────────────
  useEffect(() => {
    if (!flowData || initDone.current) return;
    initDone.current = true;

    if (sessionId) {
      getSession(sessionId)
        .then((session) => {
          if (session.answers && Object.keys(session.answers).length > 0) {
            dispatch({ type: 'RESTORE', payload: session.answers });
          }
          // Don't apply defaults — answers start empty, defaults shown in UI
        })
        .catch(() => {
          setSessionId(null);
          initDone.current = false;
        });
      return;
    }

    createSession()
      .then(({ id }) => setSessionId(id))
      .catch(() => { initDone.current = false; });
  }, [flowData, sessionId, setSessionId, dispatch]);

  // ── Clamp step index if traversal order changes ─────────────────
  useEffect(() => {
    if (traversalOrder.length > 0 && stepIndex > traversalOrder.length) {
      setStepIndex(traversalOrder.length);
    }
  }, [traversalOrder.length, stepIndex]);

  // ── Analytics: question view ───────────────────────────────────
  useEffect(() => {
    if (currentNodeData?.questionId != null && stepIndex < traversalOrder.length) {
      trackQuestionView(currentNodeData.questionId, stepIndex, totalSteps);
    }
  }, [stepIndex, currentNodeData?.questionId, totalSteps, traversalOrder.length]);

  // ── Analytics: results view ──────────────────────────────────────
  useEffect(() => {
    if (traversalOrder.length > 0 && stepIndex === traversalOrder.length) {
      trackResultsView();
    }
  }, [stepIndex, traversalOrder.length]);

  // ── Resize observer for stack animation ─────────────────────────
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

  // Cleanup exit timeout
  useEffect(() => () => {
    if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
  }, []);

  // ── Clear validation error when answer changes ──────────────────
  useEffect(() => {
    if (validationError && currentNodeData) {
      const qId = currentNodeData.questionId;
      const answer = answers[qId];
      if (answer !== undefined && answer !== null) {
        setValidationError(null);
      }
    }
  }, [answers, validationError, currentNodeData]);

  // ── Apply default when visiting a node for the first time ───────
  useEffect(() => {
    if (!currentNodeData || !flowData) return;
    const { questionId, defaultValue } = currentNodeData;
    // Don't apply default for skipped questions
    if (skipped.has(questionId)) return;
    // Only apply default if the user hasn't answered this question yet
    if (answers[questionId] === undefined && defaultValue !== undefined) {
      dispatch({ type: 'SET_ANSWER', payload: { fieldId: questionId, value: defaultValue } });
    }
  }, [currentNodeData, flowData, answers, dispatch, skipped]);

  // ── Auto-unskip when user answers a skipped question ────────────
  useEffect(() => {
    if (!currentNodeData) return;
    const qId = currentNodeData.questionId;
    if (skipped.has(qId) && answers[qId] !== undefined && answers[qId] !== null) {
      unskipQuestion(qId);
    }
  }, [answers, currentNodeData, skipped, unskipQuestion]);

  // ── Prune unreachable answers on answer change ──────────────────
  const pruneIfNeeded = useCallback(() => {
    if (!flowData || !maps) return;
    const reachable = getFullReachableNodes(flowData.rootId, answers, flowData, maps);
    const pruned = pruneAnswers(answers, reachable, flowData, maps);
    // Only dispatch if keys were actually removed
    if (Object.keys(pruned).length < Object.keys(answers).length) {
      dispatch({ type: 'PRUNE', payload: pruned });
    }
  }, [flowData, maps, answers, dispatch]);

  // ── Persist answers to server ───────────────────────────────────
  const persistAnswers = useCallback(() => {
    if (!sessionId) return;
    updateSession(sessionId, { answers }).catch(() => {});
  }, [sessionId, answers]);

  // ── Navigation ──────────────────────────────────────────────────
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
    // Validate current node before advancing
    if (currentNodeData && flowData) {
      const result = validateNode(currentNodeData, answers, currentOptions);
      if (!result.valid) {
        setValidationError(result.error);
        return;
      }
    }

    if (currentNodeData?.questionId) {
      trackQuestionAnswer(currentNodeData.questionId, answers[currentNodeData.questionId], stepIndex);
    }

    setValidationError(null);
    setReturnedFromBack(false);
    persistAnswers();
    pruneIfNeeded();

    if (isOnLastQuestion || stepIndex >= traversalOrder.length - 1) {
      setStepIndex(traversalOrder.length);
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const handleSkip = () => {
    if (currentNodeData) {
      trackQuestionSkip(currentNodeData.questionId, stepIndex);
      skipQuestion(currentNodeData.questionId);
    }

    setValidationError(null);
    setReturnedFromBack(false);
    persistAnswers();
    pruneIfNeeded();

    if (isOnLastQuestion || stepIndex >= traversalOrder.length - 1) {
      setStepIndex(traversalOrder.length);
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const handleStartOver = () => {
    persistAnswers();
    setValidationError(null);
    setReturnedFromBack(false);
    resetSkipped();
    setStepIndex(0);
  };

  // ── Loading / error states ──────────────────────────────────────
  if (flowError) {
    return (
      <main className="page page--questionnaire">
        <p className="questionnaire-error" role="alert">{flowError}</p>
      </main>
    );
  }

  if (!flowData || traversalOrder.length === 0) {
    return (
      <main className="page page--questionnaire">
        <p>Loading…</p>
      </main>
    );
  }

  // ── Render ──────────────────────────────────────────────────────
  return (
    <main className="page page--questionnaire">
      <StepIndicator currentStep={isExiting ? stepIndex - 1 : stepIndex} totalSteps={totalSteps} />
      <div className="questionnaire-stack" ref={stackContainerRef} role="region" aria-label="Questions">
        <div className="questionnaire-steps">
          {stackIds.map((id, i) => {
            const node = maps?.nodesById.get(id);
            const nodeData = node?.data;
            const optionsList = nodeData ? (flowData.options?.[nodeData.questionId] ?? []) : [];

            return (
              <div
                key={id}
                className={`questionnaire-step-slot${i < stepIndex ? ' questionnaire-step-slot--past' : ''}${i === stepIndex && isExiting ? ' questionnaire-step-slot--exiting' : ''}${i === stepIndex && returnedFromBack ? ' questionnaire-step-slot--returned-from-back' : ''}${id === RESULTS_STEP_ID ? ' questionnaire-step-slot--results' : ''}`}
                style={{
                  zIndex: i,
                  '--stack-offset': isExiting ? Math.max(0, stepIndex - 1 - i) : stepIndex - i,
                }}
                aria-hidden={i !== stepIndex}
              >
                {i === 0 && id !== RESULTS_STEP_ID && (
                  <div className="questionnaire-intro-wrap">
                    <p className="questionnaire-intro">
                      Get better results from Cursor and Claude by creating a rules file that ensures the agent
                      follows best practices tailored to your repository, the stack you use, and your own
                      developer preferences.
                    </p>
                  </div>
                )}
                {id === RESULTS_STEP_ID ? (
                  <ResultsCard
                    onBackToQuestionnaire={handleStartOver}
                    flowData={flowData}
                    skipped={skipped}
                    traversalOrder={traversalOrder}
                  />
                ) : (
                  <FlowQuestionStep
                    nodeData={nodeData}
                    optionsList={optionsList}
                    validationError={i === stepIndex ? validationError : null}
                    onSkip={i === stepIndex ? handleSkip : undefined}
                    canSkip={!nodeData?.validation?.required}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="questionnaire-nav">
        {!isFirst && (
          <button
            type="button"
            className="questionnaire-nav__back"
            onClick={goBack}
            aria-label="Back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        <div className="questionnaire-nav__center">
        </div>
        {!isLast && (
          <button
            type="button"
            className="questionnaire-nav__next"
            onClick={goNext}
            aria-label={isOnLastQuestion ? 'Generate rules' : 'Next'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
    </main>
  );
}
