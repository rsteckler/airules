/**
 * DFS traversal engine for the flow-driven questionnaire.
 *
 * Pure functions — no React, no side effects. Operates on the flow JSON
 * data structure (nodes, edges, options) and a flat answers object.
 */

// ── Condition evaluation ────────────────────────────────────────────

/**
 * Evaluate an edge "when" condition against current answers.
 *
 * Condition shapes:
 *   null / undefined                        → always true
 *   { questionId, op, value }               → leaf condition
 *   { op: "and", conditions: [...] }        → all must be true
 *   { op: "or",  conditions: [...] }        → any must be true
 *   { op: "not", condition: {...} }         → negate inner
 *
 * Leaf operators:
 *   "contains"    – answer (array) includes value
 *   "notContains" – answer (array) does NOT include value
 *   "equals"      – answer === value
 *   "notEquals"   – answer !== value
 *
 * @param {object|null} when
 * @param {object} answers
 * @returns {boolean}
 */
export function evaluateWhen(when, answers) {
  if (when == null) return true;

  // Compound operators
  if (when.op === 'and' && Array.isArray(when.conditions)) {
    return when.conditions.every((c) => evaluateWhen(c, answers));
  }
  if (when.op === 'or' && Array.isArray(when.conditions)) {
    return when.conditions.some((c) => evaluateWhen(c, answers));
  }
  if (when.op === 'not' && when.condition) {
    return !evaluateWhen(when.condition, answers);
  }

  // Leaf condition
  const { questionId, op, value } = when;
  if (!questionId || !op) return true;

  const answer = answers[questionId];

  switch (op) {
    case 'contains':
      return Array.isArray(answer) && answer.includes(value);
    case 'notContains':
      return !Array.isArray(answer) || !answer.includes(value);
    case 'equals':
      return answer === value;
    case 'notEquals':
      return answer !== value;
    default:
      return true;
  }
}

// ── Node completeness ───────────────────────────────────────────────

/**
 * Derive the companion "other text" field name for a question.
 * Convention: `${questionId}_other_text`
 *
 * @param {string} questionId
 * @returns {string}
 */
export function companionFieldName(questionId) {
  return `${questionId}_other_text`;
}

/**
 * Check whether a given option list has an "other" option.
 *
 * @param {Array} optionsList
 * @returns {boolean}
 */
export function hasOtherOption(optionsList) {
  if (!Array.isArray(optionsList)) return false;
  return optionsList.some((o) => o.type === 'other');
}

/**
 * Check whether a given option list has a "none" option.
 *
 * @param {Array} optionsList
 * @returns {boolean}
 */
export function hasNoneOption(optionsList) {
  if (!Array.isArray(optionsList)) return false;
  return optionsList.some((o) => o.type === 'none');
}

/**
 * Determine whether the "other" value is currently selected.
 *
 * @param {*} answer
 * @param {string} control – "single" or "multi"
 * @returns {boolean}
 */
function isOtherSelected(answer, control) {
  if (control === 'multi') return Array.isArray(answer) && answer.includes('other');
  return answer === 'other';
}

/**
 * Check if a node is "complete" — answered, valid, and ready to expand.
 *
 * Complete means:
 *   1. answers[questionId] is defined (not undefined)
 *   2. If "other" is selected and the question has an other option,
 *      the companion text field must be non-empty
 *   3. Lightweight per-node validation passes (minItems, required)
 *
 * @param {object} nodeData – node.data from the flow JSON
 * @param {object} answers  – flat answers object
 * @param {Array}  optionsList – options for this question (from flow.options)
 * @param {Set}    [skippedQuestionIds] – optional set of skipped question IDs
 * @returns {boolean}
 */
export function isNodeComplete(nodeData, answers, optionsList, skippedQuestionIds) {
  const { questionId, control, validation } = nodeData;

  // Skipped questions are treated as complete for traversal purposes
  if (skippedQuestionIds && skippedQuestionIds.has(questionId)) return true;

  const answer = answers[questionId];

  // 1. Must have an answer
  if (answer === undefined || answer === null) return false;

  // 2. Multi-select: must have at least one item (or validation.minItems)
  if (control === 'multi') {
    if (!Array.isArray(answer)) return false;
    const minItems = validation?.minItems ?? 0;
    if (answer.length < minItems) return false;
    if (answer.length === 0 && validation?.required) return false;
  }

  // 3. Single-select: must be a string
  if (control === 'single') {
    if (typeof answer !== 'string' || answer === '') return false;
  }

  // 4. If "other" is selected, companion text must be non-empty
  if (hasOtherOption(optionsList) && isOtherSelected(answer, control)) {
    const companion = answers[companionFieldName(questionId)];
    if (!companion || (typeof companion === 'string' && companion.trim() === '')) {
      return false;
    }
  }

  return true;
}

// ── Graph helpers ───────────────────────────────────────────────────

/**
 * Build lookup maps from the flow JSON for fast access.
 *
 * @param {object} flowData – the full flow JSON
 * @returns {{ nodesById: Map, edgesBySource: Map }}
 */
export function buildGraphMaps(flowData) {
  const nodesById = new Map();
  for (const node of flowData.nodes) {
    nodesById.set(node.id, node);
  }

  const edgesBySource = new Map();
  for (const edge of flowData.edges) {
    if (!edgesBySource.has(edge.source)) {
      edgesBySource.set(edge.source, []);
    }
    edgesBySource.get(edge.source).push(edge);
  }

  // Pre-sort each source's edges by order
  for (const [, edges] of edgesBySource) {
    edges.sort((a, b) => (a.data?.order ?? 0) - (b.data?.order ?? 0));
  }

  return { nodesById, edgesBySource };
}

// ── DFS traversal ───────────────────────────────────────────────────

/**
 * Compute the DFS traversal order starting from rootId.
 *
 * Expands past a node only if it is "complete". Returns the ordered list
 * of node IDs — both completed and the first incomplete node on each
 * branch (where expansion stops).
 *
 * @param {string} rootId
 * @param {object} answers
 * @param {object} flowData – full flow JSON (nodes, edges, options)
 * @param {{ nodesById: Map, edgesBySource: Map }} [maps] – pre-built maps (optional)
 * @param {Set} [skippedQuestionIds] – optional set of skipped question IDs
 * @returns {string[]} ordered node IDs
 */
export function computeTraversalOrder(rootId, answers, flowData, maps, skippedQuestionIds) {
  const { nodesById, edgesBySource } = maps || buildGraphMaps(flowData);
  const visited = new Set();
  const order = [];

  function dfs(nodeId) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = nodesById.get(nodeId);
    if (!node) return;

    order.push(nodeId);

    const optionsList = flowData.options?.[node.data.questionId] ?? [];

    // Only expand if this node is complete (or skipped)
    if (!isNodeComplete(node.data, answers, optionsList, skippedQuestionIds)) return;

    // Get eligible outgoing edges
    const outgoing = edgesBySource.get(nodeId) ?? [];
    for (const edge of outgoing) {
      if (evaluateWhen(edge.data?.when, answers)) {
        dfs(edge.target);
      }
    }
  }

  dfs(rootId);
  return order;
}

/**
 * Get the set of all node IDs reachable from root given current answers.
 * This includes completed nodes AND the first incomplete node on each branch.
 *
 * Used to determine which answers to keep when pruning after a change.
 *
 * @param {string} rootId
 * @param {object} answers
 * @param {object} flowData
 * @param {{ nodesById: Map, edgesBySource: Map }} [maps]
 * @returns {Set<string>}
 */
export function getReachableNodes(rootId, answers, flowData, maps) {
  return new Set(computeTraversalOrder(rootId, answers, flowData, maps));
}

/**
 * Compute the full reachable set including all nodes that COULD be reached
 * if every node were completed. Used for pruning: a node's answer should be
 * kept if the node is reachable at all (not just if it's in the current
 * DFS traversal which stops at incomplete nodes).
 *
 * @param {string} rootId
 * @param {object} answers
 * @param {object} flowData
 * @param {{ nodesById: Map, edgesBySource: Map }} [maps]
 * @returns {Set<string>}
 */
export function getFullReachableNodes(rootId, answers, flowData, maps) {
  const { nodesById, edgesBySource } = maps || buildGraphMaps(flowData);
  const visited = new Set();

  function dfs(nodeId) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = nodesById.get(nodeId);
    if (!node) return;

    // Always expand — don't check completeness
    const outgoing = edgesBySource.get(nodeId) ?? [];
    for (const edge of outgoing) {
      if (evaluateWhen(edge.data?.when, answers)) {
        dfs(edge.target);
      }
    }
  }

  dfs(rootId);
  return visited;
}

// ── Answer pruning ──────────────────────────────────────────────────

/**
 * Return a new answers object with keys removed for unreachable questions.
 * Also removes companion _other_text fields for pruned questions.
 *
 * @param {object} answers
 * @param {Set<string>} reachableNodeIds – from getFullReachableNodes
 * @param {object} flowData
 * @param {{ nodesById: Map }} [maps]
 * @returns {object} pruned answers (new object, does not mutate)
 */
export function pruneAnswers(answers, reachableNodeIds, flowData, maps) {
  const { nodesById } = maps || buildGraphMaps(flowData);

  // Build set of reachable questionIds
  const reachableQuestionIds = new Set();
  for (const nodeId of reachableNodeIds) {
    const node = nodesById.get(nodeId);
    if (node?.data?.questionId) {
      reachableQuestionIds.add(node.data.questionId);
    }
  }

  const pruned = {};
  for (const [key, value] of Object.entries(answers)) {
    // Keep if it's a reachable questionId
    if (reachableQuestionIds.has(key)) {
      pruned[key] = value;
      continue;
    }
    // Keep companion text if base question is reachable
    if (key.endsWith('_other_text')) {
      const baseKey = key.replace(/_other_text$/, '');
      if (reachableQuestionIds.has(baseKey)) {
        pruned[key] = value;
        continue;
      }
    }
    // Otherwise: pruned (not included in output)
  }

  return pruned;
}

// ── Convenience ─────────────────────────────────────────────────────

/**
 * Get the current question node ID (first incomplete in traversal order).
 * Returns null if the questionnaire is complete.
 *
 * @param {string[]} traversalOrder – from computeTraversalOrder
 * @param {object} answers
 * @param {object} flowData
 * @param {{ nodesById: Map }} [maps]
 * @param {Set} [skippedQuestionIds]
 * @returns {string|null}
 */
export function getCurrentNodeId(traversalOrder, answers, flowData, maps, skippedQuestionIds) {
  const { nodesById } = maps || buildGraphMaps(flowData);

  for (const nodeId of traversalOrder) {
    const node = nodesById.get(nodeId);
    if (!node) continue;
    const optionsList = flowData.options?.[node.data.questionId] ?? [];
    if (!isNodeComplete(node.data, answers, optionsList, skippedQuestionIds)) {
      return nodeId;
    }
  }

  return null; // All complete
}

/**
 * Get the list of completed node IDs in traversal order (for "back" navigation).
 *
 * @param {string[]} traversalOrder
 * @param {object} answers
 * @param {object} flowData
 * @param {{ nodesById: Map }} [maps]
 * @param {Set} [skippedQuestionIds]
 * @returns {string[]}
 */
export function getCompletedNodes(traversalOrder, answers, flowData, maps, skippedQuestionIds) {
  const { nodesById } = maps || buildGraphMaps(flowData);
  const completed = [];

  for (const nodeId of traversalOrder) {
    const node = nodesById.get(nodeId);
    if (!node) continue;
    const optionsList = flowData.options?.[node.data.questionId] ?? [];
    if (isNodeComplete(node.data, answers, optionsList, skippedQuestionIds)) {
      completed.push(nodeId);
    }
  }

  return completed;
}
