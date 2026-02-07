import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import * as store from '../store/sessionStore.js';

describe('POST /api/generate-rules', () => {
  beforeEach(() => {
    store.clearSessions?.();
  });

  it('returns 400 when neither sessionId nor answers provided', async () => {
    const res = await request(app).post('/api/generate-rules').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('sessionId');
  });

  it('returns 404 when sessionId is invalid', async () => {
    const res = await request(app)
      .post('/api/generate-rules')
      .send({ sessionId: 'non-existent-id' });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Session not found');
  });

  it('returns 200 with content and filename when sessionId is valid', async () => {
    const validAnswers = validMinimalAnswers();
    const createRes = await request(app)
      .post('/api/session')
      .send({ answers: validAnswers });
    const sessionId = createRes.body.id;

    const res = await request(app)
      .post('/api/generate-rules')
      .send({ sessionId });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('content');
    expect(res.body).toHaveProperty('filename');
    expect(typeof res.body.content).toBe('string');
    expect(res.body.filename).toBe('rules.md');
  });

  it('returns 200 when sending answers directly', async () => {
    const res = await request(app)
      .post('/api/generate-rules')
      .send({
        answers: validMinimalAnswers(),
      });

    expect(res.status).toBe(200);
    expect(res.body.filename).toBe('rules.md');
  });

  it('returns 400 when answers fail validation', async () => {
    const res = await request(app)
      .post('/api/generate-rules')
      .send({
        answers: { stacks: ['invalid_option'] },
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(Array.isArray(res.body.errors)).toBe(true);
  });
});

function validMinimalAnswers() {
  return {
    stacks: ['web', 'server', 'tests'],
    web_language: ['typescript'],
    web_frameworks: ['react'],
    server_language: ['typescript'],
    package_manager: 'pnpm',
    ai_permissions: ['create_files', 'edit_files'],
    always_ask_before: ['add_dependencies'],
    when_run_checks: 'after_meaningful_changes',
    git_behavior: 'push_when_asked',
    documentation_expectations: 'update_when_behavior_changes',
    security_posture: 'standard',
    output_preference: 'code_plus_brief',
    uncertainty_handling: 'ask_one_question_then_proceed',
    rules_file_structure: 'split_cursor_rules',
  };
}
