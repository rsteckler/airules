/**
 * Lightweight questionnaire answer validation (replaces AJV).
 *
 * Validates answers against the flow JSON's node validation rules and option types.
 * Server-side equivalent of client/src/engine/validator.js — the logic is duplicated
 * because the server uses CommonJS-style paths and the engine functions are small.
 */

import { getFlowData } from './loadSchema.js';

// ── Inline engine functions (duplicated from client/src/engine for server use) ──

function evaluateWhen(when, answers) {
  if (when == null) return true;
  if (when.op === 'and' && Array.isArray(when.conditions)) {
    return when.conditions.every((c) => evaluateWhen(c, answers));
  }
  if (when.op === 'or' && Array.isArray(when.conditions)) {
    return when.conditions.some((c) => evaluateWhen(c, answers));
  }
  if (when.op === 'not' && when.condition) {
    return !evaluateWhen(when.condition, answers);
  }
  const { questionId, op, value } = when;
  if (!questionId || !op) return true;
  const answer = answers[questionId];
  switch (op) {
    case 'contains': return Array.isArray(answer) && answer.includes(value);
    case 'notContains': return !Array.isArray(answer) || !answer.includes(value);
    case 'equals': return answer === value;
    case 'notEquals': return answer !== value;
    default: return true;
  }
}

function buildGraphMaps(flowData) {
  const nodesById = new Map();
  for (const node of flowData.nodes) nodesById.set(node.id, node);
  const edgesBySource = new Map();
  for (const edge of flowData.edges) {
    if (!edgesBySource.has(edge.source)) edgesBySource.set(edge.source, []);
    edgesBySource.get(edge.source).push(edge);
  }
  for (const [, edges] of edgesBySource) {
    edges.sort((a, b) => (a.data?.order ?? 0) - (b.data?.order ?? 0));
  }
  return { nodesById, edgesBySource };
}

function getFullReachableNodes(rootId, answers, flowData, maps) {
  const { nodesById, edgesBySource } = maps || buildGraphMaps(flowData);
  const visited = new Set();
  function dfs(nodeId) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    const node = nodesById.get(nodeId);
    if (!node) return;
    const outgoing = edgesBySource.get(nodeId) ?? [];
    for (const edge of outgoing) {
      if (evaluateWhen(edge.data?.when, answers)) dfs(edge.target);
    }
  }
  dfs(rootId);
  return visited;
}

function companionFieldName(questionId) {
  return `${questionId}_other_text`;
}

function hasOtherOption(optionsList) {
  return Array.isArray(optionsList) && optionsList.some((o) => o.type === 'other');
}

function hasNoneOption(optionsList) {
  return Array.isArray(optionsList) && optionsList.some((o) => o.type === 'none');
}

// ── Validation functions ────────────────────────────────────────────

function validateNode(nodeData, answers, optionsList) {
  const { questionId, control, validation } = nodeData;
  const answer = answers[questionId];
  const v = validation ?? {};

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

  if (answer === undefined || answer === null) return { valid: true };

  if (control === 'multi') {
    if (!Array.isArray(answer)) return { valid: false, error: 'Expected an array.' };
    if (v.minItems != null && answer.length < v.minItems) {
      return { valid: false, error: `Select at least ${v.minItems} option(s).` };
    }
    if (v.maxItems != null && answer.length > v.maxItems) {
      return { valid: false, error: `Select at most ${v.maxItems} option(s).` };
    }
    if (hasNoneOption(optionsList)) {
      const noneVal = optionsList.find((o) => o.type === 'none')?.value;
      if (noneVal && answer.includes(noneVal) && answer.length > 1) {
        return { valid: false, error: `"${noneVal}" cannot be combined with other selections.` };
      }
    }
    const validValues = new Set((optionsList ?? []).map((o) => o.value));
    for (const item of answer) {
      if (validValues.size > 0 && !validValues.has(item)) {
        return { valid: false, error: `Invalid option: "${item}".` };
      }
    }
  }

  if (control === 'single') {
    if (typeof answer !== 'string') return { valid: false, error: 'Expected a string.' };
    const validValues = new Set((optionsList ?? []).map((o) => o.value));
    if (validValues.size > 0 && !validValues.has(answer)) {
      return { valid: false, error: `Invalid option: "${answer}".` };
    }
  }

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
 * Validate answers against the flow JSON.
 * Returns { valid, errors } in the same shape as the old AJV-based validator.
 *
 * @param {object} answers
 * @returns {{ valid: boolean, errors: Array<{ field?: string, message: string }> }}
 */
export function validateAnswers(answers) {
  const flowData = getFlowData();
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
      errors.push({ field: questionId, message: result.error });
    }
  }

  return { valid: errors.length === 0, errors };
}
