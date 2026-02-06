/**
 * In-memory session store. Per plan §10: { id, answers, repoAnalysis?, createdAt }.
 * Keys are session ids; values are session objects.
 */
const sessions = new Map();

export function createSession(answers = null) {
  const id = crypto.randomUUID();
  const session = {
    id,
    answers: answers ?? getEmptyAnswers(),
    repoAnalysis: null,
    createdAt: new Date().toISOString(),
  };
  sessions.set(id, session);
  return session;
}

export function getSession(id) {
  return sessions.get(id) ?? null;
}

export function updateSession(id, updates) {
  const session = sessions.get(id);
  if (!session) return null;
  if (updates.answers !== undefined) session.answers = { ...session.answers, ...updates.answers };
  if (updates.repoAnalysis !== undefined) session.repoAnalysis = updates.repoAnalysis;
  sessions.set(id, session);
  return session;
}

function getEmptyAnswers() {
  return {
    projectType: null,
    frontendTech: [],
    backendTech: [],
    dataLayer: [],
    staticSite: { yes: null, path: '' },
    docsSite: { yes: null, path: '' },
    testFramework: [],
    testStrategy: [],
    favoriteAgent: null,
    otherFields: {},
    tellMeMore: {},
  };
}

/** Clear all sessions (for tests only). */
export function clearSessions() {
  sessions.clear();
}
