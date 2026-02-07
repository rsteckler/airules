/**
 * Select snippet ids from tagged manifest using tag query, scoring, and family caps.
 */

import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = path.join(__dirname, '..', '..', 'snippets', 'tagged-manifest.json');

const SCORE_EXACT = 5;
const SCORE_TAG_MATCH = 2;
const FAMILY_CAPS = {
  lang_core: 2,
  frontend_core: 2,
  backend_core: 1,
  data: 2,
  styling: 1,
  state: 1,
  testing: 2,
  build: 1,
  deploy: 1,
  docs: 1,
  utils: 2,
  security: 1,
};

let manifestCache = null;

function getTaggedManifest() {
  if (manifestCache) return manifestCache;
  const raw = readFileSync(MANIFEST_PATH, 'utf-8');
  manifestCache = JSON.parse(raw);
  return manifestCache;
}

/**
 * Score one snippet against the tag query.
 * @param {{ id: string, tags: string[], family: string }} entry
 * @param {Set<string>} tagQuery
 * @returns {number}
 */
function scoreEntry(entry, tagQuery) {
  if (!entry.tags || entry.tags.length === 0) return 0;
  let score = 0;
  for (const tag of entry.tags) {
    if (tagQuery.has(tag)) score += SCORE_EXACT;
    else score += 0;
  }
  return score;
}

/**
 * Select snippet ids: for each family, take top-scoring entries up to cap.
 * @param {Set<string>} tagQuery
 * @returns {string[]} Ordered list of snippet ids (by family order)
 */
export function selectSnippets(tagQuery) {
  const { snippets = [], familyOrder = [] } = getTaggedManifest();
  const byFamily = new Map();
  for (const s of snippets) {
    const fam = s.family || 'utils';
    if (!byFamily.has(fam)) byFamily.set(fam, []);
    byFamily.get(fam).push(s);
  }
  const selected = [];
  for (const family of familyOrder) {
    const list = byFamily.get(family) || [];
    const cap = FAMILY_CAPS[family] ?? 1;
    const scored = list
      .map((s) => ({ ...s, score: scoreEntry(s, tagQuery) }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, cap);
    for (const s of scored) selected.push(s.id);
  }
  return selected;
}
