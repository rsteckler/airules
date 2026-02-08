/**
 * Reads snippet files by path and concatenates them into a single rules document.
 *
 * Input:  string[] of snippet file paths (relative to server/snippets/).
 * Output: { content: string, filename: string }
 */

import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SNIPPETS_DIR = path.join(__dirname, '..', '..', 'snippets');

/**
 * Read snippet files and concatenate into a single rules document.
 *
 * @param {string[]} snippetPaths - Ordered, deduplicated paths relative to server/snippets/
 * @returns {Promise<{ content: string, filename: string }>}
 */
export async function generateRules(snippetPaths) {
  const parts = [];

  for (const relativePath of snippetPaths) {
    const fullPath = path.join(SNIPPETS_DIR, relativePath);
    try {
      const text = await readFile(fullPath, 'utf-8');
      if (text.trim()) {
        parts.push(text.trim());
      }
    } catch {
      // Skip missing or unreadable files
    }
  }

  const separator = '\n\n---\n\n';
  const content = parts.length
    ? parts.join(separator)
    : '# No rules selected\n\nComplete the questionnaire to generate rules.';

  return { content, filename: 'rules.md' };
}

export function getSnippetsDir() {
  return SNIPPETS_DIR;
}
