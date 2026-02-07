import { describe, it, expect } from 'vitest';
import {
  evaluateWhen,
  isNodeComplete,
  buildGraphMaps,
  computeTraversalOrder,
  getFullReachableNodes,
  pruneAnswers,
  getCurrentNodeId,
  getCompletedNodes,
  companionFieldName,
  hasOtherOption,
  hasNoneOption,
} from './traversal.js';

// ── Minimal flow fixture ────────────────────────────────────────────

const miniFlow = {
  version: 2,
  rootId: 'q_stacks',
  nodes: [
    { id: 'q_stacks', type: 'question', data: { questionId: 'stacks', label: 'Stacks', control: 'multi', validation: { required: true, minItems: 1 } }, position: { x: 0, y: 0 } },
    { id: 'q_web_lang', type: 'question', data: { questionId: 'web_language', label: 'Web Language', control: 'multi', validation: { required: true, minItems: 1 } }, position: { x: 0, y: 0 } },
    { id: 'q_web_fw', type: 'question', data: { questionId: 'web_frameworks', label: 'Web FW', control: 'multi', validation: {} }, position: { x: 0, y: 0 } },
    { id: 'q_server_lang', type: 'question', data: { questionId: 'server_language', label: 'Server Lang', control: 'multi', validation: {} }, position: { x: 0, y: 0 } },
    { id: 'q_pkg', type: 'question', data: { questionId: 'package_manager', label: 'Pkg Mgr', control: 'single', validation: { required: true } }, position: { x: 0, y: 0 } },
  ],
  edges: [
    { id: 'e1', source: 'q_stacks', target: 'q_web_lang', data: { order: 10, when: { questionId: 'stacks', op: 'contains', value: 'web' } } },
    { id: 'e2', source: 'q_stacks', target: 'q_server_lang', data: { order: 20, when: { questionId: 'stacks', op: 'contains', value: 'server' } } },
    { id: 'e3', source: 'q_stacks', target: 'q_pkg', data: { order: 100 } },
    { id: 'e4', source: 'q_web_lang', target: 'q_web_fw', data: { order: 10 } },
  ],
  options: {
    stacks: [
      { value: 'web', label: 'Web' },
      { value: 'server', label: 'Server' },
    ],
    web_language: [
      { value: 'typescript', label: 'TypeScript' },
      { value: 'other', label: 'Other', type: 'other' },
    ],
    web_frameworks: [
      { value: 'none', label: 'None', type: 'none' },
      { value: 'react', label: 'React' },
    ],
    server_language: [
      { value: 'typescript', label: 'TypeScript' },
    ],
    package_manager: [
      { value: 'pnpm', label: 'pnpm' },
      { value: 'npm', label: 'npm' },
    ],
  },
};

// ── evaluateWhen ────────────────────────────────────────────────────

describe('evaluateWhen', () => {
  it('returns true for null/undefined', () => {
    expect(evaluateWhen(null, {})).toBe(true);
    expect(evaluateWhen(undefined, {})).toBe(true);
  });

  it('contains — true when array includes value', () => {
    expect(evaluateWhen(
      { questionId: 'stacks', op: 'contains', value: 'web' },
      { stacks: ['web', 'server'] },
    )).toBe(true);
  });

  it('contains — false when array missing value', () => {
    expect(evaluateWhen(
      { questionId: 'stacks', op: 'contains', value: 'mobile' },
      { stacks: ['web', 'server'] },
    )).toBe(false);
  });

  it('contains — false when answer is not array', () => {
    expect(evaluateWhen(
      { questionId: 'x', op: 'contains', value: 'a' },
      { x: 'a' },
    )).toBe(false);
  });

  it('notContains — true when array does not include value', () => {
    expect(evaluateWhen(
      { questionId: 'stacks', op: 'notContains', value: 'mobile' },
      { stacks: ['web'] },
    )).toBe(true);
  });

  it('notContains — true when answer is not array', () => {
    expect(evaluateWhen(
      { questionId: 'x', op: 'notContains', value: 'a' },
      { x: 'b' },
    )).toBe(true);
  });

  it('equals — true', () => {
    expect(evaluateWhen(
      { questionId: 'pkg', op: 'equals', value: 'pnpm' },
      { pkg: 'pnpm' },
    )).toBe(true);
  });

  it('equals — false', () => {
    expect(evaluateWhen(
      { questionId: 'pkg', op: 'equals', value: 'pnpm' },
      { pkg: 'npm' },
    )).toBe(false);
  });

  it('notEquals — true', () => {
    expect(evaluateWhen(
      { questionId: 'pkg', op: 'notEquals', value: 'pnpm' },
      { pkg: 'npm' },
    )).toBe(true);
  });

  it('and — all must be true', () => {
    const cond = {
      op: 'and',
      conditions: [
        { questionId: 'stacks', op: 'contains', value: 'web' },
        { questionId: 'stacks', op: 'contains', value: 'server' },
      ],
    };
    expect(evaluateWhen(cond, { stacks: ['web', 'server'] })).toBe(true);
    expect(evaluateWhen(cond, { stacks: ['web'] })).toBe(false);
  });

  it('or — any must be true', () => {
    const cond = {
      op: 'or',
      conditions: [
        { questionId: 'stacks', op: 'contains', value: 'web' },
        { questionId: 'stacks', op: 'contains', value: 'mobile' },
      ],
    };
    expect(evaluateWhen(cond, { stacks: ['web'] })).toBe(true);
    expect(evaluateWhen(cond, { stacks: ['data'] })).toBe(false);
  });

  it('not — negation', () => {
    const cond = {
      op: 'not',
      condition: { questionId: 'stacks', op: 'contains', value: 'web' },
    };
    expect(evaluateWhen(cond, { stacks: ['web'] })).toBe(false);
    expect(evaluateWhen(cond, { stacks: ['server'] })).toBe(true);
  });
});

// ── isNodeComplete ──────────────────────────────────────────────────

describe('isNodeComplete', () => {
  const multiNode = { questionId: 'stacks', control: 'multi', validation: { required: true, minItems: 1 } };
  const singleNode = { questionId: 'pkg', control: 'single', validation: { required: true } };

  it('incomplete when no answer', () => {
    expect(isNodeComplete(multiNode, {}, [])).toBe(false);
  });

  it('incomplete when multi has empty array', () => {
    expect(isNodeComplete(multiNode, { stacks: [] }, [])).toBe(false);
  });

  it('complete when multi has items', () => {
    expect(isNodeComplete(multiNode, { stacks: ['web'] }, [])).toBe(true);
  });

  it('complete when single has value', () => {
    expect(isNodeComplete(singleNode, { pkg: 'pnpm' }, [])).toBe(true);
  });

  it('incomplete when single is empty string', () => {
    expect(isNodeComplete(singleNode, { pkg: '' }, [])).toBe(false);
  });

  it('incomplete when other selected but companion empty', () => {
    const opts = [{ value: 'a', label: 'A' }, { value: 'other', label: 'Other', type: 'other' }];
    const data = { questionId: 'lang', control: 'multi', validation: {} };
    expect(isNodeComplete(data, { lang: ['other'] }, opts)).toBe(false);
    expect(isNodeComplete(data, { lang: ['other'], lang_other_text: 'foo' }, opts)).toBe(true);
  });
});

// ── buildGraphMaps ──────────────────────────────────────────────────

describe('buildGraphMaps', () => {
  it('builds node and edge lookup maps', () => {
    const { nodesById, edgesBySource } = buildGraphMaps(miniFlow);
    expect(nodesById.size).toBe(5);
    expect(nodesById.get('q_stacks').data.questionId).toBe('stacks');
    expect(edgesBySource.get('q_stacks').length).toBe(3);
    // Edges should be sorted by order
    const orders = edgesBySource.get('q_stacks').map((e) => e.data.order);
    expect(orders).toEqual([10, 20, 100]);
  });
});

// ── computeTraversalOrder ───────────────────────────────────────────

describe('computeTraversalOrder', () => {
  it('returns only root when no answers', () => {
    const order = computeTraversalOrder('q_stacks', {}, miniFlow);
    expect(order).toEqual(['q_stacks']);
  });

  it('expands web branch when stacks includes web', () => {
    const answers = { stacks: ['web'] };
    const order = computeTraversalOrder('q_stacks', answers, miniFlow);
    // stacks complete → expands all eligible children:
    //   web_lang (order 10, eligible) → stops (not complete)
    //   server_lang (order 20, not eligible — no server in stacks)
    //   pkg (order 100, unconditional) → stops (not complete)
    expect(order).toEqual(['q_stacks', 'q_web_lang', 'q_pkg']);
  });

  it('full traversal with all answers', () => {
    const answers = {
      stacks: ['web', 'server'],
      web_language: ['typescript'],
      web_frameworks: ['react'],
      server_language: ['typescript'],
      package_manager: 'pnpm',
    };
    const order = computeTraversalOrder('q_stacks', answers, miniFlow);
    expect(order).toEqual([
      'q_stacks',
      'q_web_lang',
      'q_web_fw',
      'q_server_lang',
      'q_pkg',
    ]);
  });

  it('skips server branch when server not in stacks', () => {
    const answers = {
      stacks: ['web'],
      web_language: ['typescript'],
      web_frameworks: ['react'],
      package_manager: 'pnpm',
    };
    const order = computeTraversalOrder('q_stacks', answers, miniFlow);
    expect(order).toEqual(['q_stacks', 'q_web_lang', 'q_web_fw', 'q_pkg']);
  });
});

// ── getFullReachableNodes ───────────────────────────────────────────

describe('getFullReachableNodes', () => {
  it('includes all nodes reachable from satisfied edges', () => {
    const answers = { stacks: ['web', 'server'] };
    const reachable = getFullReachableNodes('q_stacks', answers, miniFlow);
    expect(reachable.has('q_stacks')).toBe(true);
    expect(reachable.has('q_web_lang')).toBe(true);
    expect(reachable.has('q_web_fw')).toBe(true);
    expect(reachable.has('q_server_lang')).toBe(true);
    expect(reachable.has('q_pkg')).toBe(true);
  });

  it('excludes nodes behind unsatisfied edges', () => {
    const answers = { stacks: ['web'] };
    const reachable = getFullReachableNodes('q_stacks', answers, miniFlow);
    expect(reachable.has('q_server_lang')).toBe(false);
    expect(reachable.has('q_web_lang')).toBe(true);
  });
});

// ── pruneAnswers ────────────────────────────────────────────────────

describe('pruneAnswers', () => {
  it('removes answers for unreachable nodes', () => {
    const answers = {
      stacks: ['web'],
      web_language: ['typescript'],
      server_language: ['python'],
      server_language_other_text: 'elixir',
      package_manager: 'pnpm',
    };
    const reachable = getFullReachableNodes('q_stacks', answers, miniFlow);
    const pruned = pruneAnswers(answers, reachable, miniFlow);
    expect(pruned.stacks).toEqual(['web']);
    expect(pruned.web_language).toEqual(['typescript']);
    expect(pruned.package_manager).toBe('pnpm');
    // server_language and its companion should be pruned
    expect(pruned.server_language).toBeUndefined();
    expect(pruned.server_language_other_text).toBeUndefined();
  });

  it('keeps companion text for reachable nodes', () => {
    const answers = {
      stacks: ['web'],
      web_language: ['other'],
      web_language_other_text: 'elm',
    };
    const reachable = getFullReachableNodes('q_stacks', answers, miniFlow);
    const pruned = pruneAnswers(answers, reachable, miniFlow);
    expect(pruned.web_language_other_text).toBe('elm');
  });
});

// ── getCurrentNodeId ────────────────────────────────────────────────

describe('getCurrentNodeId', () => {
  it('returns root when no answers', () => {
    const order = computeTraversalOrder('q_stacks', {}, miniFlow);
    expect(getCurrentNodeId(order, {}, miniFlow)).toBe('q_stacks');
  });

  it('returns null when all complete', () => {
    const answers = {
      stacks: ['web'],
      web_language: ['typescript'],
      web_frameworks: ['react'],
      package_manager: 'pnpm',
    };
    const order = computeTraversalOrder('q_stacks', answers, miniFlow);
    expect(getCurrentNodeId(order, answers, miniFlow)).toBeNull();
  });

  it('returns first incomplete node', () => {
    const answers = { stacks: ['web'] };
    const order = computeTraversalOrder('q_stacks', answers, miniFlow);
    expect(getCurrentNodeId(order, answers, miniFlow)).toBe('q_web_lang');
  });
});

// ── getCompletedNodes ───────────────────────────────────────────────

describe('getCompletedNodes', () => {
  it('returns completed nodes in order', () => {
    const answers = { stacks: ['web'], web_language: ['typescript'] };
    const order = computeTraversalOrder('q_stacks', answers, miniFlow);
    const completed = getCompletedNodes(order, answers, miniFlow);
    expect(completed).toEqual(['q_stacks', 'q_web_lang']);
  });
});

// ── Utility functions ───────────────────────────────────────────────

describe('companionFieldName', () => {
  it('appends _other_text', () => {
    expect(companionFieldName('web_language')).toBe('web_language_other_text');
  });
});

describe('hasOtherOption / hasNoneOption', () => {
  const opts = [
    { value: 'a', label: 'A' },
    { value: 'none', label: 'None', type: 'none' },
    { value: 'other', label: 'Other', type: 'other' },
  ];

  it('hasOtherOption returns true', () => {
    expect(hasOtherOption(opts)).toBe(true);
    expect(hasOtherOption([{ value: 'a', label: 'A' }])).toBe(false);
  });

  it('hasNoneOption returns true', () => {
    expect(hasNoneOption(opts)).toBe(true);
    expect(hasNoneOption([{ value: 'a', label: 'A' }])).toBe(false);
  });
});
