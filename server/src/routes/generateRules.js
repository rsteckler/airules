import { Router } from 'express';
import { getSession } from '../store/sessionStore.js';
import { validateAnswers } from '../schema/validate.js';
import { runAgentFlow } from '../services/agentFlow.js';
import { generateRules } from '../services/rulesGenerator.js';

export const generateRulesRoutes = Router();

/**
 * POST /api/generate-rules
 * Body: { sessionId?: string, answers?: object }
 * Returns: { content: string, filename: string }
 */
generateRulesRoutes.post('/generate-rules', async (req, res) => {
  const body = req.body || {};
  let answers = body.answers;

  if (body.sessionId) {
    const session = getSession(body.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    answers = session.answers;
  }

  if (!answers) {
    return res.status(400).json({ error: 'Missing sessionId or answers' });
  }

  const { valid, errors } = validateAnswers(answers);
  if (!valid) {
    return res.status(400).json({ error: 'Validation failed', errors });
  }

  try {
    const result = runAgentFlow(answers);
    const { snippetKeys, format, baseContent } = result;
    const { content, filename } = await generateRules({ snippetKeys, format, baseContent });
    res.json({ content, filename });
  } catch (err) {
    console.error('generate-rules error:', err);
    res.status(500).json({ error: 'Failed to generate rules' });
  }
});
