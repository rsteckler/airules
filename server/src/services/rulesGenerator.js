/**
 * Loads snippet files by key and concatenates them into a single rules document.
 * Per plan §5: given { snippetKeys, format }, returns { content, filename }.
 */

import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.join(__dirname, '..', '..');
const SNIPPETS_DIR = path.join(SERVER_ROOT, 'snippets');

const FORMAT_FILENAMES = {
  cursor: 'rules.md',
  claude: 'claude.md',
  generic: 'rules.md',
};

let manifestCache = null;

async function loadManifest() {
  if (manifestCache) return manifestCache;
  const manifestPath = path.join(SNIPPETS_DIR, 'manifest.json');
  const raw = await readFile(manifestPath, 'utf-8');
  const data = JSON.parse(raw);
  manifestCache = data.snippets || data;
  return manifestCache;
}

/**
 * Load a single snippet by key. Returns file contents or empty string if missing/invalid.
 * @param {string} key - Snippet key from manifest
 * @param {Record<string, string>} manifest - Key → relative path map
 * @returns {Promise<string>}
 */
async function loadSnippet(key, manifest) {
  const relativePath = manifest[key];
  if (!relativePath) return '';
  const fullPath = path.join(SNIPPETS_DIR, relativePath);
  try {
    return await readFile(fullPath, 'utf-8');
  } catch {
    return '';
  }
}

/**
 * Generate rules content from snippet keys and format.
 * @param {{ snippetKeys: string[], format: 'cursor'|'claude'|'generic', baseContent?: string }} options
 * @returns {Promise<{ content: string, filename: string }>}
 */
export async function generateRules(options) {
  const { snippetKeys = [], format = 'cursor', baseContent } = options;
  const manifest = await loadManifest();
  const parts = [];
  if (baseContent && baseContent.trim()) {
    parts.push(baseContent.trim());
  }
  for (const key of snippetKeys) {
    if (key === 'base' && baseContent) continue;
    const text = await loadSnippet(key, manifest);
    if (text.trim()) {
      parts.push(text.trim());
    }
  }
  const separator = '\n\n---\n\n';
  const content = parts.length ? parts.join(separator) : '# No rules selected\n\nComplete the questionnaire to generate rules.';
  const filename = FORMAT_FILENAMES[format] ?? FORMAT_FILENAMES.generic;
  return { content, filename };
}

export function getSnippetsDir() {
  return SNIPPETS_DIR;
}
