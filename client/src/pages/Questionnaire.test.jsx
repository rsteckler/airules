import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Questionnaire } from './Questionnaire';
import { QuestionnaireProvider } from '../context/QuestionnaireContext';
import * as api from '../api/client';
import { minimalFlow } from '../test/schemaFixture';

vi.mock('../api/client');

function renderQuestionnaire(props = {}) {
  return render(
    <QuestionnaireProvider>
      <Questionnaire
        onBackToStart={props.onBackToStart ?? (() => {})}
        {...props}
      />
    </QuestionnaireProvider>
  );
}

describe('Questionnaire page', () => {
  beforeEach(() => {
    vi.mocked(api.getQuestionnaireFlow).mockResolvedValue(minimalFlow);
    vi.mocked(api.createSession).mockResolvedValue({ id: 'test-session-id' });
    vi.mocked(api.getSession).mockResolvedValue({ id: 'test-session-id', answers: {}, createdAt: '' });
    vi.mocked(api.updateSession).mockResolvedValue({});
  });

  it('shows loading until flow data is fetched', async () => {
    renderQuestionnaire();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /what's in your stack/i })).toBeInTheDocument();
    });
  });

  it('shows first step (stacks) after flow loads', async () => {
    renderQuestionnaire();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /what's in your stack/i })).toBeInTheDocument();
    });
    // First step has no back button
    expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
  });

  it('shows step indicator after flow loads', async () => {
    renderQuestionnaire();
    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('advances to next DFS node when clicking Next', async () => {
    const user = userEvent.setup();
    renderQuestionnaire();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /what's in your stack/i })).toBeInTheDocument();
    });
    // Default value includes 'web', so web_fw is reachable.
    // Just click Next — stacks default is valid (minItems: 1).
    await user.click(screen.getByRole('button', { name: /next/i }));
    // DFS order: q_stacks -> q_web_fw -> q_pkg
    // So next step should be web_frameworks
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /web framework/i })).toBeInTheDocument();
    });
  });
});
