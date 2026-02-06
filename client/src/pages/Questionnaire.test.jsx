import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Questionnaire } from './Questionnaire';
import { QuestionnaireProvider } from '../context/QuestionnaireContext';

function renderQuestionnaire(props = {}) {
  return render(
    <QuestionnaireProvider>
      <Questionnaire
        onBackToStart={props.onBackToStart ?? (() => {})}
        onShowResults={props.onShowResults ?? (() => {})}
        {...props}
      />
    </QuestionnaireProvider>
  );
}

describe('Questionnaire page', () => {
  it('shows first step (project type)', () => {
    renderQuestionnaire();
    expect(screen.getByRole('heading', { name: /what type of project/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^next$/i })).toBeInTheDocument();
  });

  it('shows step indicator (progress bar)', () => {
    renderQuestionnaire();
    expect(screen.getByRole('progressbar', { name: /step 1 of/i })).toBeInTheDocument();
  });

  it('after selecting Backend only, next step is backend tech (not frontend)', async () => {
    const user = userEvent.setup();
    renderQuestionnaire();
    await user.click(screen.getByRole('radio', { name: /backend only/i }));
    await user.click(screen.getByRole('button', { name: /^next$/i }));
    expect(screen.getByRole('heading', { name: /backend technologies/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /frontend technologies/i })).not.toBeInTheDocument();
  });

  it('after selecting Frontend only, next step is frontend tech', async () => {
    const user = userEvent.setup();
    renderQuestionnaire();
    await user.click(screen.getByRole('radio', { name: /frontend only/i }));
    await user.click(screen.getByRole('button', { name: /^next$/i }));
    expect(screen.getByRole('heading', { name: /frontend technologies/i })).toBeInTheDocument();
  });

  it('Back goes to previous step', async () => {
    const user = userEvent.setup();
    renderQuestionnaire();
    await user.click(screen.getByRole('radio', { name: /backend only/i }));
    await user.click(screen.getByRole('button', { name: /^next$/i }));
    expect(screen.getByRole('heading', { name: /backend technologies/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^back$/i }));
    const heading = await screen.findByRole('heading', { name: /what type of project/i }, { timeout: 500 });
    expect(heading).toBeInTheDocument();
  });
});
