/**
 * Maps questionnaire answers to an ordered, deduplicated list of snippet file paths
 * using snippet-map.json.
 *
 * Input:  flat answers object from the questionnaire.
 * Output: string[] of snippet file paths (relative to server/snippets/).
 */

import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SNIPPET_MAP_PATH = path.join(__dirname, '..', '..', 'snippet-map.json');

let mapCache = null;

function getSnippetMap() {
  if (mapCache) return mapCache;
  const raw = readFileSync(SNIPPET_MAP_PATH, 'utf-8');
  mapCache = JSON.parse(raw);
  return mapCache;
}

/**
 * Resolve questionnaire answers to an ordered, deduplicated list of snippet file paths.
 *
 * Logic:
 * - Always include globalSnippets first.
 * - For each question in snippet-map.json (order preserved):
 *   - Skip if the answer is missing/null (question was skipped or not reached).
 *   - If the question has a defaultSnippet, include it when any non-"none" mapped value is selected.
 *   - For each selected value, look it up in the question's map and include the snippet(s).
 *   - Arrays of paths (e.g. ["languages/typescript.md", "languages/javascript.md"]) are flattened.
 * - Deduplicate: each snippet path is included only once (first occurrence wins).
 *
 * @param {object} answers - Flat answers object from the questionnaire
 * @returns {string[]} Ordered, deduplicated snippet file paths relative to server/snippets/
 */
export function resolveSnippets(answers) {
  if (!answers) return [];

  const snippetMap = getSnippetMap();
  const seen = new Set();
  const snippetPaths = [];

  function addSnippet(relativePath) {
    if (!relativePath || seen.has(relativePath)) return;
    seen.add(relativePath);
    snippetPaths.push(relativePath);
  }

  // Always include global snippets first
  for (const s of snippetMap.globalSnippets || []) {
    addSnippet(s);
  }

  // Process each question in map order
  for (const [questionId, config] of Object.entries(snippetMap.questions)) {
    const answer = answers[questionId];
    if (answer === undefined || answer === null) continue;

    const values = Array.isArray(answer) ? answer : [answer];

    // Check if any selected value maps to a snippet and is not "none"
    const hasNonNone = values.some((v) => v !== 'none' && config.map[v]);

    // Include defaultSnippet when question is answered with a non-none mapped value
    if (config.defaultSnippet && hasNonNone) {
      addSnippet(config.defaultSnippet);
    }

    // Include snippets for each selected value
    for (const value of values) {
      const mapped = config.map[value];
      if (!mapped) continue;
      if (Array.isArray(mapped)) {
        for (const p of mapped) addSnippet(p);
      } else {
        addSnippet(mapped);
      }
    }
  }

  return snippetPaths;
}
