import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../index.js';

describe('GET /api/questionnaire-flow', () => {
  it('returns the questionnaire flow JSON', async () => {
    const res = await request(app).get('/api/questionnaire-flow');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('version', 2);
    expect(res.body).toHaveProperty('rootId');
    expect(res.body).toHaveProperty('nodes');
    expect(res.body).toHaveProperty('edges');
    expect(res.body).toHaveProperty('options');
    expect(Array.isArray(res.body.nodes)).toBe(true);
    expect(Array.isArray(res.body.edges)).toBe(true);
    expect(typeof res.body.options).toBe('object');
    // Check root node exists
    const rootNode = res.body.nodes.find((n) => n.id === res.body.rootId);
    expect(rootNode).toBeDefined();
    expect(rootNode.data.questionId).toBe('stacks');
  });

  it('returns flow JSON on deprecated /api/questionnaire-schema too', async () => {
    const res = await request(app).get('/api/questionnaire-schema');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('version', 2);
  });
});
