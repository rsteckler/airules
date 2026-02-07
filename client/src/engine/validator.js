/**
 * Lightweight validator for the flow-driven questionnaire.
 *
 * Replaces AJV / JSON Schema validation. Validates answers against
 * node data.validation rules and option type constraints.
 */

import {
  companionFieldName,
  hasOtherOption,
  hasNoneOption,
  getFullReachableNodes,
  buildGraphMaps,
} from './traversal.js';

/**
 * Validate a single node's answer.
 *
 * @param {object} nodeData – node.data from flow JSON
 * @param {object} answers  – full flat answers object
 * @param {Array}  optionsList – options for this question
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateNode(nodeData, answers, optionsList) {
  const { questionId, control, validation } = nodeData;
  const answer = answers[questionId];
  const v = validation ?? {};

  // Required check
  if (v.required) {
    if (answer === undefined || answer === null) {
      return { valid: false, error: 'This field is required.' };
    }
    if (control === 'multi' && Array.isArray(answer) && answer.length === 0) {
      return { valid: false, error: 'Select at least one option.' };
    }
    if (control === 'single' && answer === '') {
      return { valid: false, error: 'This field is required.' };
    }
  }

  // If no answer and not required, it's fine
  if (answer === undefined || answer === null) {
    return { valid: true };
  }

  // Multi-select validations
  if (control === 'multi') {
    if (!Array.isArray(answer)) {
      return { valid: false, error: 'Expected an array.' };
    }
    if (v.minItems != null && answer.length < v.minItems) {
      return { valid: false, error: `Select at least ${v.minItems} option(s).` };
    }
    if (v.maxItems != null && answer.length > v.maxItems) {
      return { valid: false, error: `Select at most ${v.maxItems} option(s).` };
    }

    // None exclusivity: if "none" is selected, must be the only item
    if (hasNoneOption(optionsList)) {
      const noneVal = optionsList.find((o) => o.type === 'none')?.value;
      if (noneVal && answer.includes(noneVal) && answer.length > 1) {
        return { valid: false, error: `"${noneVal}" cannot be combined with other selections.` };
      }
    }

    // Check all values are valid enum values
    const validValues = new Set((optionsList ?? []).map((o) => o.value));
    for (const item of answer) {
      if (validValues.size > 0 && !validValues.has(item)) {
        return { valid: false, error: `Invalid option: "${item}".` };
      }
    }
  }

  // Single-select validations
  if (control === 'single') {
    if (typeof answer !== 'string') {
      return { valid: false, error: 'Expected a string.' };
    }
    const validValues = new Set((optionsList ?? []).map((o) => o.value));
    if (validValues.size > 0 && !validValues.has(answer)) {
      return { valid: false, error: `Invalid option: "${answer}".` };
    }
  }

  // Other-text companion validation
  if (hasOtherOption(optionsList)) {
    const otherSelected =
      control === 'multi'
        ? Array.isArray(answer) && answer.includes('other')
        : answer === 'other';

    if (otherSelected) {
      const companion = answers[companionFieldName(questionId)];
      if (!companion || (typeof companion === 'string' && companion.trim() === '')) {
        return { valid: false, error: 'Please specify a value for "Other".' };
      }
    }
  }

  return { valid: true };
}

/**
 * Validate all reachable nodes' answers.
 *
 * @param {object} flowData – full flow JSON
 * @param {object} answers  – flat answers object
 * @returns {{ valid: boolean, errors: Array<{ nodeId: string, field: string, message: string }> }}
 */
export function validateAll(flowData, answers) {
  const maps = buildGraphMaps(flowData);
  const reachable = getFullReachableNodes(flowData.rootId, answers, flowData, maps);
  const errors = [];

  for (const nodeId of reachable) {
    const node = maps.nodesById.get(nodeId);
    if (!node) continue;

    const { questionId } = node.data;
    const optionsList = flowData.options?.[questionId] ?? [];
    const result = validateNode(node.data, answers, optionsList);

    if (!result.valid) {
      errors.push({
        nodeId,
        field: questionId,
        message: result.error,
      });
    }
  }

  return { valid: errors.length === 0, errors };
}
