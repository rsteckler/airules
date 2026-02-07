/**
 * Minimal questionnaire flow JSON for tests (matches questionnaire-flow.json shape).
 */
export const minimalFlow = {
  version: 2,
  rootId: 'q_stacks',
  nodes: [
    {
      id: 'q_stacks',
      type: 'question',
      data: {
        questionId: 'stacks',
        label: "What's in your stack?",
        control: 'multi',
        defaultValue: ['web', 'server'],
        validation: { required: true, minItems: 1 },
      },
      position: { x: 0, y: 0 },
    },
    {
      id: 'q_web_fw',
      type: 'question',
      data: {
        questionId: 'web_frameworks',
        label: 'Web framework(s)',
        control: 'multi',
        defaultValue: ['react'],
        validation: {},
      },
      position: { x: 0, y: 150 },
    },
    {
      id: 'q_pkg',
      type: 'question',
      data: {
        questionId: 'package_manager',
        label: 'Package manager',
        control: 'single',
        defaultValue: 'pnpm',
        validation: { required: true },
      },
      position: { x: 200, y: 0 },
    },
  ],
  edges: [
    {
      id: 'e1',
      source: 'q_stacks',
      target: 'q_web_fw',
      data: { order: 10, when: { questionId: 'stacks', op: 'contains', value: 'web' } },
    },
    {
      id: 'e2',
      source: 'q_stacks',
      target: 'q_pkg',
      data: { order: 100 },
    },
  ],
  options: {
    stacks: [
      { value: 'web', label: 'Web' },
      { value: 'server', label: 'Server' },
      { value: 'mobile', label: 'Mobile' },
      { value: 'cli', label: 'CLI' },
      { value: 'tests', label: 'Tests' },
      { value: 'docs', label: 'Docs' },
    ],
    web_frameworks: [
      { value: 'none', label: 'None', type: 'none' },
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
    ],
    package_manager: [
      { value: 'pnpm', label: 'pnpm' },
      { value: 'npm', label: 'npm' },
    ],
  },
  viewport: { x: 0, y: 0, zoom: 1 },
};

/**
 * @deprecated Use minimalFlow instead. Kept for backward compatibility.
 */
export const minimalSchema = minimalFlow;
