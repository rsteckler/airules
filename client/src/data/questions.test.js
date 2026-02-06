import { describe, it, expect } from 'vitest';
import {
  QUESTION_IDS,
  QUESTION_ORDER,
  questions,
  questionsById,
  getVisibleQuestionIds,
  isQuestionVisible,
} from './questions';

describe('questions data', () => {
  it('exports all question ids in QUESTION_ORDER', () => {
    expect(QUESTION_ORDER).toContain(QUESTION_IDS.PROJECT_TYPE);
    expect(QUESTION_ORDER).toContain(QUESTION_IDS.FRONTEND_TECH);
    expect(QUESTION_ORDER).toContain(QUESTION_IDS.BACKEND_TECH);
    expect(QUESTION_ORDER).toContain(QUESTION_IDS.DATA_LAYER);
    expect(QUESTION_ORDER).toContain(QUESTION_IDS.STATIC_SITE);
    expect(QUESTION_ORDER).toContain(QUESTION_IDS.DOCS_SITE);
    expect(QUESTION_ORDER).toContain(QUESTION_IDS.TEST_FRAMEWORK);
    expect(QUESTION_ORDER).toContain(QUESTION_IDS.TEST_STRATEGY);
    expect(QUESTION_ORDER).toContain(QUESTION_IDS.FAVORITE_AGENT);
    expect(QUESTION_ORDER).toHaveLength(9);
  });

  it('has questionsById for every id in QUESTION_ORDER', () => {
    QUESTION_ORDER.forEach((id) => {
      expect(questionsById[id]).toBeDefined();
      expect(questionsById[id].id).toBe(id);
      expect(questionsById[id].label).toBeTruthy();
    });
  });

  it('questions array length matches QUESTION_ORDER', () => {
    expect(questions).toHaveLength(QUESTION_ORDER.length);
  });
});

describe('isQuestionVisible', () => {
  it('always shows project type', () => {
    expect(isQuestionVisible(QUESTION_IDS.PROJECT_TYPE, {})).toBe(true);
    expect(isQuestionVisible(QUESTION_IDS.PROJECT_TYPE, { projectType: 'fe' })).toBe(true);
  });

  it('shows frontend tech only for fe and fullstack', () => {
    expect(isQuestionVisible(QUESTION_IDS.FRONTEND_TECH, {})).toBe(false);
    expect(isQuestionVisible(QUESTION_IDS.FRONTEND_TECH, { projectType: 'fe' })).toBe(true);
    expect(isQuestionVisible(QUESTION_IDS.FRONTEND_TECH, { projectType: 'fullstack' })).toBe(true);
    expect(isQuestionVisible(QUESTION_IDS.FRONTEND_TECH, { projectType: 'be' })).toBe(false);
    expect(isQuestionVisible(QUESTION_IDS.FRONTEND_TECH, { projectType: 'data' })).toBe(false);
  });

  it('shows backend tech only for be, data, fullstack', () => {
    expect(isQuestionVisible(QUESTION_IDS.BACKEND_TECH, {})).toBe(false);
    expect(isQuestionVisible(QUESTION_IDS.BACKEND_TECH, { projectType: 'fe' })).toBe(false);
    expect(isQuestionVisible(QUESTION_IDS.BACKEND_TECH, { projectType: 'be' })).toBe(true);
    expect(isQuestionVisible(QUESTION_IDS.BACKEND_TECH, { projectType: 'data' })).toBe(true);
    expect(isQuestionVisible(QUESTION_IDS.BACKEND_TECH, { projectType: 'fullstack' })).toBe(true);
  });

  it('shows data layer only for be, data, fullstack', () => {
    expect(isQuestionVisible(QUESTION_IDS.DATA_LAYER, { projectType: 'fe' })).toBe(false);
    expect(isQuestionVisible(QUESTION_IDS.DATA_LAYER, { projectType: 'be' })).toBe(true);
    expect(isQuestionVisible(QUESTION_IDS.DATA_LAYER, { projectType: 'data' })).toBe(true);
    expect(isQuestionVisible(QUESTION_IDS.DATA_LAYER, { projectType: 'fullstack' })).toBe(true);
  });

  it('always shows static site, docs site, test framework, test strategy, favorite agent', () => {
    const alwaysVisible = [
      QUESTION_IDS.STATIC_SITE,
      QUESTION_IDS.DOCS_SITE,
      QUESTION_IDS.TEST_FRAMEWORK,
      QUESTION_IDS.TEST_STRATEGY,
      QUESTION_IDS.FAVORITE_AGENT,
    ];
    alwaysVisible.forEach((id) => {
      expect(isQuestionVisible(id, { projectType: 'fe' })).toBe(true);
      expect(isQuestionVisible(id, { projectType: 'be' })).toBe(true);
    });
  });

  it('returns false for unknown question id', () => {
    expect(isQuestionVisible('unknown', { projectType: 'fe' })).toBe(false);
  });
});

describe('getVisibleQuestionIds', () => {
  it('returns project type plus always-visible steps when no projectType selected', () => {
    const ids = getVisibleQuestionIds({});
    expect(ids).toContain(QUESTION_IDS.PROJECT_TYPE);
    expect(ids).toContain(QUESTION_IDS.STATIC_SITE);
    expect(ids).toContain(QUESTION_IDS.DOCS_SITE);
    expect(ids).toContain(QUESTION_IDS.TEST_FRAMEWORK);
    expect(ids).toContain(QUESTION_IDS.TEST_STRATEGY);
    expect(ids).toContain(QUESTION_IDS.FAVORITE_AGENT);
    expect(ids).not.toContain(QUESTION_IDS.FRONTEND_TECH);
    expect(ids).not.toContain(QUESTION_IDS.BACKEND_TECH);
    expect(ids).not.toContain(QUESTION_IDS.DATA_LAYER);
    expect(ids).toHaveLength(6);
  });

  it('returns FE path for projectType fe', () => {
    const ids = getVisibleQuestionIds({ projectType: 'fe' });
    expect(ids).toContain(QUESTION_IDS.PROJECT_TYPE);
    expect(ids).toContain(QUESTION_IDS.FRONTEND_TECH);
    expect(ids).not.toContain(QUESTION_IDS.BACKEND_TECH);
    expect(ids).not.toContain(QUESTION_IDS.DATA_LAYER);
    expect(ids).toContain(QUESTION_IDS.STATIC_SITE);
    expect(ids).toContain(QUESTION_IDS.DOCS_SITE);
    expect(ids).toContain(QUESTION_IDS.TEST_FRAMEWORK);
    expect(ids).toContain(QUESTION_IDS.TEST_STRATEGY);
    expect(ids).toContain(QUESTION_IDS.FAVORITE_AGENT);
    expect(ids).toHaveLength(7);
  });

  it('returns BE path for projectType be (no frontend)', () => {
    const ids = getVisibleQuestionIds({ projectType: 'be' });
    expect(ids).not.toContain(QUESTION_IDS.FRONTEND_TECH);
    expect(ids).toContain(QUESTION_IDS.BACKEND_TECH);
    expect(ids).toContain(QUESTION_IDS.DATA_LAYER);
    expect(ids).toHaveLength(8);
  });

  it('returns full path for projectType fullstack', () => {
    const ids = getVisibleQuestionIds({ projectType: 'fullstack' });
    expect(ids).toContain(QUESTION_IDS.FRONTEND_TECH);
    expect(ids).toContain(QUESTION_IDS.BACKEND_TECH);
    expect(ids).toContain(QUESTION_IDS.DATA_LAYER);
    expect(ids).toHaveLength(9);
  });

  it('preserves QUESTION_ORDER order', () => {
    const ids = getVisibleQuestionIds({ projectType: 'fullstack' });
    const order = ids.map((id) => QUESTION_ORDER.indexOf(id));
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });
});
