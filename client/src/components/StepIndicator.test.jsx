import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StepIndicator } from './StepIndicator';

describe('StepIndicator', () => {
  it('renders step count', () => {
    render(<StepIndicator currentStep={0} totalSteps={5} />);
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
  });

  it('renders current step correctly', () => {
    render(<StepIndicator currentStep={2} totalSteps={5} />);
    expect(screen.getByText('Step 3 of 5')).toBeInTheDocument();
  });

  it('has progressbar role', () => {
    render(<StepIndicator currentStep={1} totalSteps={3} />);
    const bar = screen.getByRole('progressbar', { name: undefined });
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute('aria-valuenow', '2');
    expect(bar).toHaveAttribute('aria-valuemin', '1');
    expect(bar).toHaveAttribute('aria-valuemax', '3');
  });

  it('returns null when totalSteps is 0', () => {
    const { container } = render(<StepIndicator currentStep={0} totalSteps={0} />);
    expect(container.firstChild).toBeNull();
  });
});
