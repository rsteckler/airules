import React, { createContext, useContext, useReducer, useState } from 'react';

/**
 * Answers shape aligned with plan §10:
 * { projectType, frontendTech, backendTech, dataLayer, staticSite, docsSite, testFramework, testStrategy, favoriteAgent, otherFields, tellMeMore }
 * - Multi-select fields (frontendTech, backendTech, dataLayer, testFramework, testStrategy) are arrays of values.
 * - Yes/no + path (staticSite, docsSite) are { yes: boolean, path?: string }.
 * - otherFields[id] = custom string when user picks "Other".
 * - tellMeMore[id] = optional free text per question.
 */

const initialState = {
  projectType: null,
  frontendTech: [],
  backendTech: [],
  dataLayer: [],
  staticSite: { yes: null, path: '' },
  docsSite: { yes: null, path: '' },
  testFramework: [],
  testStrategy: [],
  favoriteAgent: null,
  otherFields: {},
  tellMeMore: {},
};

function questionnaireReducer(state, action) {
  switch (action.type) {
    case 'SET_ANSWER': {
      const { questionId, value } = action.payload;
      return { ...state, [questionId]: value };
    }
    case 'SET_OTHER': {
      const { questionId, text } = action.payload;
      return {
        ...state,
        otherFields: { ...state.otherFields, [questionId]: text },
      };
    }
    case 'SET_TELL_ME_MORE': {
      const { questionId, text } = action.payload;
      return {
        ...state,
        tellMeMore: { ...state.tellMeMore, [questionId]: text },
      };
    }
    case 'RESET':
      return initialState;
    case 'RESTORE':
      return { ...initialState, ...action.payload };
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

  const setSessionId = (id) => {
    setSessionIdState(id);
    setStoredSessionId(id);
  };

  return (
    <QuestionnaireContext.Provider value={{ answers: state, dispatch, sessionId, setSessionId }}>
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const ctx = useContext(QuestionnaireContext);
  if (!ctx) throw new Error('useQuestionnaire must be used within QuestionnaireProvider');
  return ctx;
}
