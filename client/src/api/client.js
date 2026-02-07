/**
 * API client for the airules backend. Uses VITE_API_URL (default http://localhost:3000).
 */

const getBaseUrl = () => import.meta.env?.VITE_API_URL?.trim() || 'http://localhost:3000';

async function request(path, options = {}) {
  const base = getBaseUrl().replace(/\/$/, '');
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = new Error(res.statusText || `HTTP ${res.status}`);
    err.status = res.status;
    try {
      err.body = await res.json();
    } catch {
      err.body = await res.text();
    }
    throw err;
  }
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

/**
 * Create a new session. Optional initial answers.
 * @param {{ answers?: object }} body
 * @returns {Promise<{ id: string }>}
 */
export async function createSession(body = {}) {
  return request('/api/session', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Get session by id.
 * @param {string} id
 * @returns {Promise<{ id: string, answers: object, repoAnalysis?: object, createdAt: string }>}
 */
export async function getSession(id) {
  return request(`/api/session/${encodeURIComponent(id)}`);
}

/**
 * Update session (partial answers and/or repoAnalysis).
 * @param {string} id
 * @param {{ answers?: object, repoAnalysis?: object }} body
 */
export async function updateSession(id, body) {
  return request(`/api/session/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

/**
 * Fetch the questionnaire flow JSON (nodes, edges, options).
 * @returns {Promise<object>}
 */
export async function getQuestionnaireFlow() {
  return request('/api/questionnaire-flow');
}

/**
 * @deprecated Use getQuestionnaireFlow() instead.
 */
export async function getQuestionnaireSchema() {
  return request('/api/questionnaire-flow');
}

/**
 * Generate rules. Pass either sessionId or answers.
 * @param {{ sessionId?: string, answers?: object }} body
 * @returns {Promise<{ content: string, filename: string }>}
 */
export async function generateRules(body) {
  return request('/api/generate-rules', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export { getBaseUrl };
