import React, { createContext, useContext, useReducer, useState, useCallback } from 'react';

/**
 * Questionnaire context.
 *
 * Answers are a flat object keyed by questionId (stacks, web_language, etc.).
 * Companion "other" fields (e.g. web_language_other_text) are stored as normal keys.
 *
 * Skipped questions are tracked in a separate Set. Skipping omits the question
 * from the final results. Only non-required questions can be skipped.
 */

const initialState = {};

function questionnaireReducer(state, action) {
  switch (action.type) {
    case 'SET_ANSWER': {
      const { fieldId, value } = action.payload;
      return { ...state, [fieldId]: value };
    }
    case 'DELETE_ANSWER': {
      const { fieldId } = action.payload;
      const next = { ...state };
      delete next[fieldId];
      // Also remove companion _other_text field
      const companionKey = `${fieldId}_other_text`;
      delete next[companionKey];
      return next;
    }
    case 'RESET':
      return initialState;
    case 'RESTORE':
      return { ...initialState, ...action.payload };
    case 'PRUNE': {
      // Replace answers with a pruned copy (removes unreachable keys)
      return { ...action.payload };
    }
    default:
      return state;
  }
}

const SESSION_STORAGE_KEY = 'airules_session_id';

function getStoredSessionId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_STORAGE_KEY);
}

function setStoredSessionId(id) {
  if (typeof window === 'undefined') return;
  if (id) localStorage.setItem(SESSION_STORAGE_KEY, id);
  else localStorage.removeItem(SESSION_STORAGE_KEY);
}

const QuestionnaireContext = createContext(null);

export function QuestionnaireProvider({ children }) {
  const [state, dispatch] = useReducer(questionnaireReducer, initialState);
  const [sessionId, setSessionIdState] = useState(() => getStoredSessionId());
  const [skipped, setSkipped] = useState(new Set());

  const setSessionId = (id) => {
    setSessionIdState(id);
    setStoredSessionId(id);
  };

  const skipQuestion = useCallback((questionId) => {
    dispatch({ type: 'DELETE_ANSWER', payload: { fieldId: questionId } });
    setSkipped((prev) => {
      const next = new Set(prev);
      next.add(questionId);
      return next;
    });
  }, []);

  const unskipQuestion = useCallback((questionId) => {
    setSkipped((prev) => {
      if (!prev.has(questionId)) return prev;
      const next = new Set(prev);
      next.delete(questionId);
      return next;
    });
  }, []);

  const resetSkipped = useCallback(() => setSkipped(new Set()), []);

  return (
    <QuestionnaireContext.Provider
      value={{ answers: state, dispatch, sessionId, setSessionId, skipped, skipQuestion, unskipQuestion, resetSkipped }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const ctx = useContext(QuestionnaireContext);
  if (!ctx) throw new Error('useQuestionnaire must be used within QuestionnaireProvider');
  return ctx;
}
