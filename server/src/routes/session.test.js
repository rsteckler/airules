import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';
import * as store from '../store/sessionStore.js';

describe('session API', () => {
  beforeEach(() => {
    store.clearSessions?.();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  describe('POST /api/session', () => {
    it('creates session and returns id', async () => {
      const res = await request(app).post('/api/session').send({});
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(typeof res.body.id).toBe('string');
      expect(res.body.id.length).toBeGreaterThan(0);
    });

    it('accepts initial answers', async () => {
      const validAnswers = validMinimalAnswers();
      const res = await request(app)
        .post('/api/session')
        .send({ answers: validAnswers });
      expect(res.status).toBe(201);
      const getRes = await request(app).get(`/api/session/${res.body.id}`);
      expect(getRes.body.answers.stacks).toEqual(validAnswers.stacks);
    });
  });

  describe('GET /api/session/:id', () => {
    it('returns session when found', async () => {
      const createRes = await request(app).post('/api/session').send({});
      const id = createRes.body.id;
      const res = await request(app).get(`/api/session/${id}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id,
        answers: expect.any(Object),
        createdAt: expect.any(String),
      });
    });

    it('returns 404 when session not found', async () => {
      const res = await request(app).get('/api/session/non-existent-id');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Session not found');
    });
  });

  describe('PATCH /api/session/:id', () => {
    it('updates answers and returns session', async () => {
      const createRes = await request(app).post('/api/session').send({});
      const id = createRes.body.id;
      const answers = validMinimalAnswers();
      const res = await request(app)
        .patch(`/api/session/${id}`)
        .send({ answers });
      expect(res.status).toBe(200);
      expect(res.body.answers.stacks).toEqual(['web', 'server', 'tests']);
    });

    it('returns 400 when answers fail validation', async () => {
      const createRes = await request(app).post('/api/session').send({});
      const id = createRes.body.id;
      // stacks with invalid enum value
      const res = await request(app)
        .patch(`/api/session/${id}`)
        .send({ answers: { stacks: ['invalid_enum'] } });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(Array.isArray(res.body.errors)).toBe(true);
    });

    it('returns 404 when session not found', async () => {
      const res = await request(app)
        .patch('/api/session/non-existent-id')
        .send({ answers: validMinimalAnswers() });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Session not found');
    });
  });
});

/**
 * Valid answers for all reachable required nodes when stacks = ['web', 'server', 'tests'].
 * Must include answers for every reachable node with `validation.required: true`.
 */
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
