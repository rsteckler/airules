/**
 * Flow export/import JSON shape.
 *
 * v2 format adds: rootId, options (for questionnaire flows).
 * Backward compatible: v1 flows (no rootId/options) still import fine.
 */

export const FLOW_VERSION = 2;

export function createEmptyFlow() {
  return {
    version: FLOW_VERSION,
    rootId: null,
    viewport: { x: 0, y: 0, zoom: 1 },
    nodes: [],
    edges: [],
    options: {},
  };
}

/**
 * Normalize flow JSON from React Flow's state into our schema.
 * Preserves rootId and options if present.
 */
export function normalizeFlowFromRF(rfObject, extra = {}) {
  return {
    version: FLOW_VERSION,
    rootId: extra.rootId ?? null,
    viewport: rfObject.viewport ?? { x: 0, y: 0, zoom: 1 },
    nodes: Array.isArray(rfObject.nodes) ? rfObject.nodes : [],
    edges: Array.isArray(rfObject.edges) ? rfObject.edges : [],
    options: extra.options ?? {},
  };
}

/**
 * Validate and normalize imported JSON for loading into React Flow.
 * Returns { version, rootId, viewport, nodes, edges, options }.
 */
export function flowFromJSON(jsonString) {
  let parsed;
  try {
    parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
  } catch (e) {
    throw new Error('Invalid JSON');
  }
  const flow = {
    version: parsed.version ?? 1,
    rootId: parsed.rootId ?? null,
    viewport: parsed.viewport ?? { x: 0, y: 0, zoom: 1 },
    nodes: Array.isArray(parsed.nodes) ? parsed.nodes : [],
    edges: Array.isArray(parsed.edges) ? parsed.edges : [],
    options: parsed.options ?? {},
  };
  return flow;
}
