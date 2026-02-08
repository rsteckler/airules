/**
 * Google Analytics gtag helpers. No-op if gtag is not loaded (e.g. adblock).
 */
function gtagSafe(...args) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

export function trackQuestionView(questionId, stepIndex, totalSteps) {
  gtagSafe('event', 'question_view', {
    question_id: questionId,
    step_index: stepIndex + 1,
    total_steps: totalSteps,
  });
}

export function trackQuestionAnswer(questionId, value, stepIndex) {
  gtagSafe('event', 'question_answer', {
    question_id: questionId,
    value: Array.isArray(value) ? value.join(',') : String(value ?? ''),
    step_index: stepIndex + 1,
  });
}

export function trackQuestionSkip(questionId, stepIndex) {
  gtagSafe('event', 'question_skip', {
    question_id: questionId,
    step_index: stepIndex + 1,
  });
}

export function trackResultsView() {
  gtagSafe('event', 'results_view');
}
