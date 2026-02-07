/**
 * Load questionnaire flow JSON from server/questionnaire-flow.json.
 * Replaces the old questions.json / JSON Schema loader.
 */

import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FLOW_PATH = path.join(__dirname, '..', '..', 'questionnaire-flow.json');

let cachedFlow = null;

/**
 * Full flow JSON as stored on disk.
 * @returns {object}
 */
export function getFlowData() {
  if (cachedFlow) return cachedFlow;
  const raw = readFileSync(FLOW_PATH, 'utf-8');
  cachedFlow = JSON.parse(raw);
  return cachedFlow;
}

/**
 * @deprecated Use getFlowData() instead. Kept temporarily for backward compat.
 */
export function getSchema() {
  return getFlowData();
}
