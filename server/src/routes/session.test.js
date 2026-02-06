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
      const res = await request(app)
        .post('/api/session')
        .send({ answers: { projectType: 'fe' } });
      expect(res.status).toBe(201);
      const getRes = await request(app).get(`/api/session/${res.body.id}`);
      expect(getRes.body.answers.projectType).toBe('fe');
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
      expect(res.body.answers).toHaveProperty('projectType');
      expect(res.body.answers).toHaveProperty('frontendTech');
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
      const res = await request(app)
        .patch(`/api/session/${id}`)
        .send({ answers: { projectType: 'fullstack', frontendTech: ['react'] } });
      expect(res.status).toBe(200);
      expect(res.body.answers.projectType).toBe('fullstack');
      expect(res.body.answers.frontendTech).toEqual(['react']);

      const getRes = await request(app).get(`/api/session/${id}`);
      expect(getRes.body.answers.projectType).toBe('fullstack');
      expect(getRes.body.answers.frontendTech).toEqual(['react']);
    });

    it('returns 404 when session not found', async () => {
      const res = await request(app)
        .patch('/api/session/non-existent-id')
        .send({ answers: { projectType: 'fe' } });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Session not found');
    });
  });
});
