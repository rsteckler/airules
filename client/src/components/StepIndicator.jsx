import React from 'react';

export function StepIndicator({ currentStep, totalSteps }) {
  if (totalSteps <= 0) return null;
  const step = Math.min(currentStep + 1, totalSteps);
  const percent = totalSteps === 1 ? 100 : ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div
      className="step-indicator"
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${step} of ${totalSteps}`}
    >
      <div className="step-indicator__bar" style={{ width: `${percent}%` }} />
    </div>
  );
}
