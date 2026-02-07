import { Router } from 'express';
import { createSession, getSession, updateSession } from '../store/sessionStore.js';
import { validateAnswers } from '../schema/validate.js';

export const sessionRoutes = Router();

// POST /api/session — create session, return { id }
sessionRoutes.post('/session', (req, res) => {
  const body = req.body || {};
  const session = createSession(body.answers ?? null);
  res.status(201).json({ id: session.id });
});

// GET /api/session/:id
sessionRoutes.get('/session/:id', (req, res) => {
  const session = getSession(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(session);
});

// PATCH /api/session/:id — update answers (and optionally repoAnalysis). Validates answers.
sessionRoutes.patch('/session/:id', (req, res) => {
  const session = getSession(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  if (req.body.answers !== undefined) {
    const { valid, errors } = validateAnswers(req.body.answers);
    if (!valid) {
      return res.status(400).json({ error: 'Validation failed', errors });
    }
  }
  const updated = updateSession(req.params.id, req.body);
  res.json(updated);
});
