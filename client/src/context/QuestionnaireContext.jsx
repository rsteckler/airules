import React, { createContext, useContext, useReducer } from 'react';

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
      if (questionId === 'staticSite' || questionId === 'docsSite') {
        return { ...state, [questionId]: value };
      }
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
    default:
      return state;
  }
}

const QuestionnaireContext = createContext(null);

export function QuestionnaireProvider({ children }) {
  const [state, dispatch] = useReducer(questionnaireReducer, initialState);
  return (
    <QuestionnaireContext.Provider value={{ answers: state, dispatch }}>
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const ctx = useContext(QuestionnaireContext);
  if (!ctx) throw new Error('useQuestionnaire must be used within QuestionnaireProvider');
  return ctx;
}
