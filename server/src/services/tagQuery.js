/**
 * Build a tag query (desired tags) from questionnaire answers using answer-tag-config.
 */

import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, '..', '..', 'snippets', 'answer-tag-config.json');

let configCache = null;

function getConfig() {
  if (configCache) return configCache;
  const raw = readFileSync(CONFIG_PATH, 'utf-8');
  configCache = JSON.parse(raw);
  return configCache;
}

/**
 * @param {object} answers - New schema answers
 * @returns {Set<string>} Desired tags (e.g. "frontend:react", "lang:python")
 */
export function buildTagQuery(answers) {
  if (!answers) return new Set();
  const { tagMappings = [] } = getConfig();
  const tags = new Set();
  for (const m of tagMappings) {
    const val = answers[m.answerKey];
    if (val == null) continue;
    if (Array.isArray(val)) {
      if (val.includes(m.value)) m.tags.forEach((t) => tags.add(t));
    } else if (val === m.value) {
      m.tags.forEach((t) => tags.add(t));
    }
  }
  return tags;
}
