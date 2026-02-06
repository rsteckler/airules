/**
 * Questionnaire model per plan §3. Each question supports "other" and optional "tell me more".
 * Branching: visibility is derived from projectType (see visibleWhen).
 */

export const QUESTION_IDS = {
  PROJECT_TYPE: 'projectType',
  FRONTEND_TECH: 'frontendTech',
  BACKEND_TECH: 'backendTech',
  DATA_LAYER: 'dataLayer',
  STATIC_SITE: 'staticSite',
  DOCS_SITE: 'docsSite',
  TEST_FRAMEWORK: 'testFramework',
  TEST_STRATEGY: 'testStrategy',
  FAVORITE_AGENT: 'favoriteAgent',
};

/** Project types that show the frontend tech question */
const SHOW_FRONTEND = ['fe', 'fullstack'];
/** Project types that show the backend tech question */
const SHOW_BACKEND = ['be', 'data', 'fullstack'];
/** Project types that show the data layer question */
const SHOW_DATA_LAYER = ['be', 'data', 'fullstack'];

/**
 * @param {string} questionId
 * @param {{ projectType?: string }} answers
 * @returns {boolean}
 */
export function isQuestionVisible(questionId, answers) {
  const pt = answers.projectType;
  switch (questionId) {
    case QUESTION_IDS.PROJECT_TYPE:
      return true;
    case QUESTION_IDS.FRONTEND_TECH:
      return pt != null && SHOW_FRONTEND.includes(pt);
    case QUESTION_IDS.BACKEND_TECH:
      return pt != null && SHOW_BACKEND.includes(pt);
    case QUESTION_IDS.DATA_LAYER:
      return pt != null && SHOW_DATA_LAYER.includes(pt);
    case QUESTION_IDS.STATIC_SITE:
    case QUESTION_IDS.DOCS_SITE:
    case QUESTION_IDS.TEST_FRAMEWORK:
    case QUESTION_IDS.TEST_STRATEGY:
    case QUESTION_IDS.FAVORITE_AGENT:
      return true;
    default:
      return false;
  }
}

/**
 * Ordered list of question ids for the flow. Branching is applied when rendering steps.
 */
export const QUESTION_ORDER = [
  QUESTION_IDS.PROJECT_TYPE,
  QUESTION_IDS.FRONTEND_TECH,
  QUESTION_IDS.BACKEND_TECH,
  QUESTION_IDS.DATA_LAYER,
  QUESTION_IDS.STATIC_SITE,
  QUESTION_IDS.DOCS_SITE,
  QUESTION_IDS.TEST_FRAMEWORK,
  QUESTION_IDS.TEST_STRATEGY,
  QUESTION_IDS.FAVORITE_AGENT,
];

/**
 * Get the list of visible question ids in order for current answers.
 * @param {{ projectType?: string }} answers
 * @returns {string[]}
 */
export function getVisibleQuestionIds(answers) {
  return QUESTION_ORDER.filter((id) => isQuestionVisible(id, answers));
}

export const questions = [
  {
    id: QUESTION_IDS.PROJECT_TYPE,
    label: 'What type of project is this?',
    type: 'single',
    options: [
      { value: 'fe', label: 'Frontend only' },
      { value: 'be', label: 'Backend only' },
      { value: 'data', label: 'Data only' },
      { value: 'fullstack', label: 'Full-stack (monorepo)' },
    ],
    otherOption: true,
    tellMeMore: true,
  },
  {
    id: QUESTION_IDS.FRONTEND_TECH,
    label: 'Which frontend technologies do you use?',
    type: 'multi',
    options: [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'svelte', label: 'Svelte' },
      { value: 'next', label: 'Next.js' },
      { value: 'remix', label: 'Remix' },
    ],
    otherOption: true,
    tellMeMore: true,
  },
  {
    id: QUESTION_IDS.BACKEND_TECH,
    label: 'Which backend technologies do you use?',
    type: 'multi',
    options: [
      { value: 'node', label: 'Node.js' },
      { value: 'python', label: 'Python' },
      { value: 'go', label: 'Go' },
    ],
    otherOption: true,
    tellMeMore: true,
  },
  {
    id: QUESTION_IDS.DATA_LAYER,
    label: 'What data layer do you use?',
    type: 'multi',
    options: [
      { value: 'sql', label: 'SQL' },
      { value: 'nosql', label: 'NoSQL' },
      { value: 'prisma', label: 'Prisma' },
      { value: 'django-orm', label: 'Django ORM' },
    ],
    otherOption: true,
    tellMeMore: true,
  },
  {
    id: QUESTION_IDS.STATIC_SITE,
    label: 'Is there a static site in the repo?',
    type: 'yesno',
    optionalPath: true,
    pathLabel: 'Path (optional)',
    pathPlaceholder: 'e.g. docs/ or storybook/',
    tellMeMore: true,
  },
  {
    id: QUESTION_IDS.DOCS_SITE,
    label: 'Is there a docs website in the repo?',
    type: 'yesno',
    optionalPath: true,
    pathLabel: 'Path (optional)',
    pathPlaceholder: 'e.g. docs/ or docusaurus/',
    tellMeMore: true,
  },
  {
    id: QUESTION_IDS.TEST_FRAMEWORK,
    label: 'Which test framework(s) do you use?',
    type: 'multi',
    options: [
      { value: 'jest', label: 'Jest' },
      { value: 'vitest', label: 'Vitest' },
      { value: 'pytest', label: 'pytest' },
      { value: 'mocha', label: 'Mocha' },
      { value: 'playwright', label: 'Playwright' },
    ],
    otherOption: true,
    tellMeMore: true,
  },
  {
    id: QUESTION_IDS.TEST_STRATEGY,
    label: 'When should agents run tests?',
    type: 'multi',
    options: [
      { value: 'before-respond', label: 'Before responding' },
      { value: 'before-commit', label: 'Before commit' },
      { value: 'before-push', label: 'Before push' },
      { value: 'never', label: 'Never' },
    ],
    otherOption: false,
    tellMeMore: true,
  },
  {
    id: QUESTION_IDS.FAVORITE_AGENT,
    label: 'Favorite AI agent (output format)',
    type: 'single',
    options: [
      { value: 'cursor', label: 'Cursor' },
      { value: 'claude', label: 'Claude' },
      { value: 'generic', label: 'Generic' },
    ],
    otherOption: false,
    tellMeMore: false,
  },
];

export const questionsById = Object.fromEntries(questions.map((q) => [q.id, q]));
