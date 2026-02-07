import { Router } from 'express';
import { getFlowData } from '../schema/loadSchema.js';

export const schemaRoutes = Router();

/**
 * GET /api/questionnaire-flow
 * Returns the full questionnaire flow JSON (nodes, edges, options) for the client.
 */
schemaRoutes.get('/questionnaire-flow', (_req, res) => {
  try {
    const flowData = getFlowData();
    res.json(flowData);
  } catch (err) {
    console.error('questionnaire-flow error:', err);
    res.status(500).json({ error: 'Failed to load questionnaire flow' });
  }
});

/**
 * GET /api/questionnaire-schema (deprecated — redirects to flow)
 * Kept temporarily so old clients don't break.
 */
schemaRoutes.get('/questionnaire-schema', (_req, res) => {
  try {
    const flowData = getFlowData();
    res.json(flowData);
  } catch (err) {
    console.error('questionnaire-schema error:', err);
    res.status(500).json({ error: 'Failed to load questionnaire flow' });
  }
});
