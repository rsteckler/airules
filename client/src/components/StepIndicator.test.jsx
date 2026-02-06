import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StepIndicator } from './StepIndicator';

describe('StepIndicator', () => {
  it('renders progress bar with step count in aria-label', () => {
    render(<StepIndicator currentStep={0} totalSteps={5} />);
    const bar = screen.getByRole('progressbar', { name: 'Step 1 of 5' });
    expect(bar).toBeInTheDocument();
  });

  it('reflects current step in aria-valuenow and aria-label', () => {
    render(<StepIndicator currentStep={2} totalSteps={5} />);
    const bar = screen.getByRole('progressbar', { name: 'Step 3 of 5' });
    expect(bar).toHaveAttribute('aria-valuenow', '3');
    expect(bar).toHaveAttribute('aria-valuemax', '5');
  });

  it('has progressbar role and aria attributes', () => {
    render(<StepIndicator currentStep={1} totalSteps={3} />);
    const bar = screen.getByRole('progressbar', { name: 'Step 2 of 3' });
    expect(bar).toHaveAttribute('aria-valuenow', '2');
    expect(bar).toHaveAttribute('aria-valuemin', '1');
    expect(bar).toHaveAttribute('aria-valuemax', '3');
  });

  it('returns null when totalSteps is 0', () => {
    const { container } = render(<StepIndicator currentStep={0} totalSteps={0} />);
    expect(container.firstChild).toBeNull();
  });
});
