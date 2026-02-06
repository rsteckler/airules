import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuestionStep } from './QuestionStep';
import { QuestionnaireProvider } from '../context/QuestionnaireContext';
import { QUESTION_IDS } from '../data/questions';

function renderWithProvider(ui) {
  return render(<QuestionnaireProvider>{ui}</QuestionnaireProvider>);
}

describe('QuestionStep', () => {
  it('renders project type question with options', () => {
    renderWithProvider(<QuestionStep questionId={QUESTION_IDS.PROJECT_TYPE} />);
    expect(screen.getByRole('heading', { name: /what type of project/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /frontend only/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /backend only/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /full-stack/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /^other$/i })).toBeInTheDocument();
  });

  it('selecting project type updates context', async () => {
    const user = userEvent.setup();
    renderWithProvider(<QuestionStep questionId={QUESTION_IDS.PROJECT_TYPE} />);
    await user.click(screen.getByRole('radio', { name: /backend only/i }));
    expect(screen.getByRole('radio', { name: /backend only/i })).toBeChecked();
  });

  it('renders multi-select for frontend tech', () => {
    renderWithProvider(<QuestionStep questionId={QUESTION_IDS.FRONTEND_TECH} />);
    expect(screen.getByRole('heading', { name: /frontend technologies/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /react/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /vue/i })).toBeInTheDocument();
  });

  it('renders yes/no for static site with optional path', () => {
    renderWithProvider(<QuestionStep questionId={QUESTION_IDS.STATIC_SITE} />);
    expect(screen.getByRole('heading', { name: /static site/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /^yes$/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /^no$/i })).toBeInTheDocument();
  });

  it('renders favorite agent options', () => {
    renderWithProvider(<QuestionStep questionId={QUESTION_IDS.FAVORITE_AGENT} />);
    expect(screen.getByRole('heading', { name: /favorite AI agent/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /cursor/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /claude/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /generic/i })).toBeInTheDocument();
  });

  it('returns null for unknown question id', () => {
    const { container } = renderWithProvider(<QuestionStep questionId="unknown" />);
    expect(container.firstChild).toBeNull();
  });

  it('selecting "Other" on project type shows the "Please specify" input', async () => {
    const user = userEvent.setup();
    renderWithProvider(<QuestionStep questionId={QUESTION_IDS.PROJECT_TYPE} />);
    await user.click(screen.getByRole('radio', { name: /^other$/i }));
    expect(screen.getByLabelText(/please specify/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/please describe/i)).toBeInTheDocument();
  });

  it('typing in "Other" input updates context', async () => {
    const user = userEvent.setup();
    renderWithProvider(<QuestionStep questionId={QUESTION_IDS.PROJECT_TYPE} />);
    await user.click(screen.getByRole('radio', { name: /^other$/i }));
    const input = screen.getByLabelText(/please specify/i);
    await user.type(input, 'Custom project type');
    expect(input).toHaveValue('Custom project type');
  });

  it('question with tellMeMore shows optional context textarea', () => {
    renderWithProvider(<QuestionStep questionId={QUESTION_IDS.PROJECT_TYPE} />);
    expect(screen.getByLabelText(/optional - add more context/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/optional - add more context/i)).toBeInTheDocument();
  });

  it('typing in optional context textarea updates context', async () => {
    const user = userEvent.setup();
    renderWithProvider(<QuestionStep questionId={QUESTION_IDS.PROJECT_TYPE} />);
    const textarea = screen.getByLabelText(/optional - add more context/i);
    await user.type(textarea, 'Some extra context');
    expect(textarea).toHaveValue('Some extra context');
  });

  it('shows "Skip this question" when onSkip is provided and calls it on click', async () => {
    const user = userEvent.setup();
    const onSkip = vi.fn();
    renderWithProvider(
      <QuestionStep questionId={QUESTION_IDS.PROJECT_TYPE} onSkip={onSkip} />
    );
    const skipBtn = screen.getByRole('button', { name: /skip this question/i });
    expect(skipBtn).toBeInTheDocument();
    await user.click(skipBtn);
    expect(onSkip).toHaveBeenCalledTimes(1);
  });
});
