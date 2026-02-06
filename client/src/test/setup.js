import '@testing-library/jest-dom/vitest';

// Mock ResizeObserver for jsdom (used by Questionnaire stack)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
