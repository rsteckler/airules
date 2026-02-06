import { Router } from 'express';
import { createSession, getSession, updateSession } from '../store/sessionStore.js';

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

// PATCH /api/session/:id — update answers (and optionally repoAnalysis)
sessionRoutes.patch('/session/:id', (req, res) => {
  const session = updateSession(req.params.id, req.body);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(session);
});
