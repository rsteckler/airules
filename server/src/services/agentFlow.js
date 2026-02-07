/**
 * Maps questionnaire answers to snippet keys and output format.
 * Input: flat answers from the flow-driven questionnaire.
 * Output: { snippetKeys, format, baseContent }.
 */

import { buildTagQuery } from './tagQuery.js';
import { selectSnippets } from './snippetSelector.js';
import { generateBaseRules } from './baseRulesGenerator.js';

const DEFAULT_FORMAT = 'cursor';

/**
 * Run agent flow: answers → { snippetKeys, format, baseContent }.
 *
 * Uses the tag query pipeline: answers → tags → snippet selection → base rules.
 *
 * @param {object} answers - Session answers (flat object from questionnaire-flow.json)
 * @returns {{ snippetKeys: string[], format: 'cursor'|'claude'|'generic', baseContent?: string }}
 */
export function runAgentFlow(answers) {
  if (!answers) return { snippetKeys: ['base'], format: DEFAULT_FORMAT };

  const tagQuery = buildTagQuery(answers);
  const snippetKeys = selectSnippets(tagQuery);
  const baseContent = generateBaseRules(answers);
  const format = DEFAULT_FORMAT;
  return { snippetKeys, format, baseContent };
}
