import { describe, it, expect } from 'vitest';
import { validateNode, validateAll } from './validator.js';

// ── validateNode ────────────────────────────────────────────────────

describe('validateNode', () => {
  it('required multi — invalid when empty', () => {
    const data = { questionId: 'stacks', control: 'multi', validation: { required: true, minItems: 1 } };
    expect(validateNode(data, {}, []).valid).toBe(false);
    expect(validateNode(data, { stacks: [] }, []).valid).toBe(false);
  });

  it('required multi — valid when has items', () => {
    const data = { questionId: 'stacks', control: 'multi', validation: { required: true, minItems: 1 } };
    expect(validateNode(data, { stacks: ['web'] }, []).valid).toBe(true);
  });

  it('required single — invalid when missing', () => {
    const data = { questionId: 'pkg', control: 'single', validation: { required: true } };
    expect(validateNode(data, {}, []).valid).toBe(false);
    expect(validateNode(data, { pkg: '' }, []).valid).toBe(false);
  });

  it('required single — valid when present', () => {
    const data = { questionId: 'pkg', control: 'single', validation: { required: true } };
    expect(validateNode(data, { pkg: 'pnpm' }, [{ value: 'pnpm', label: 'pnpm' }]).valid).toBe(true);
  });

  it('not required — valid when missing', () => {
    const data = { questionId: 'x', control: 'single', validation: {} };
    expect(validateNode(data, {}, []).valid).toBe(true);
  });

  it('minItems — invalid below minimum', () => {
    const data = { questionId: 'x', control: 'multi', validation: { minItems: 2 } };
    expect(validateNode(data, { x: ['a'] }, []).valid).toBe(false);
    expect(validateNode(data, { x: ['a', 'b'] }, []).valid).toBe(true);
  });

  it('none exclusivity — invalid when none plus others', () => {
    const data = { questionId: 'x', control: 'multi', validation: {} };
    const opts = [
      { value: 'none', label: 'None', type: 'none' },
      { value: 'a', label: 'A' },
    ];
    expect(validateNode(data, { x: ['none', 'a'] }, opts).valid).toBe(false);
    expect(validateNode(data, { x: ['none'] }, opts).valid).toBe(true);
  });

  it('invalid enum value — single', () => {
    const data = { questionId: 'x', control: 'single', validation: {} };
    const opts = [{ value: 'a', label: 'A' }];
    expect(validateNode(data, { x: 'b' }, opts).valid).toBe(false);
  });

  it('invalid enum value — multi', () => {
    const data = { questionId: 'x', control: 'multi', validation: {} };
    const opts = [{ value: 'a', label: 'A' }];
    expect(validateNode(data, { x: ['b'] }, opts).valid).toBe(false);
  });

  it('other text required when other selected — multi', () => {
    const data = { questionId: 'lang', control: 'multi', validation: {} };
    const opts = [
      { value: 'ts', label: 'TS' },
      { value: 'other', label: 'Other', type: 'other' },
    ];
    expect(validateNode(data, { lang: ['other'] }, opts).valid).toBe(false);
    expect(validateNode(data, { lang: ['other'], lang_other_text: 'elm' }, opts).valid).toBe(true);
  });

  it('other text required when other selected — single', () => {
    const data = { questionId: 'lang', control: 'single', validation: {} };
    const opts = [
      { value: 'ts', label: 'TS' },
      { value: 'other', label: 'Other', type: 'other' },
    ];
    expect(validateNode(data, { lang: 'other' }, opts).valid).toBe(false);
    expect(validateNode(data, { lang: 'other', lang_other_text: 'elm' }, opts).valid).toBe(true);
  });
});

// ── validateAll ─────────────────────────────────────────────────────

describe('validateAll', () => {
  const miniFlow = {
    version: 2,
    rootId: 'q_root',
    nodes: [
      { id: 'q_root', type: 'question', data: { questionId: 'root_q', control: 'multi', validation: { required: true, minItems: 1 } }, position: { x: 0, y: 0 } },
      { id: 'q_child', type: 'question', data: { questionId: 'child_q', control: 'single', validation: { required: true } }, position: { x: 0, y: 0 } },
    ],
    edges: [
      { id: 'e1', source: 'q_root', target: 'q_child', data: { order: 10, when: { questionId: 'root_q', op: 'contains', value: 'a' } } },
    ],
    options: {
      root_q: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }],
      child_q: [{ value: 'x', label: 'X' }],
    },
  };

  it('valid when all reachable nodes answered correctly', () => {
    const answers = { root_q: ['a'], child_q: 'x' };
    const result = validateAll(miniFlow, answers);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('invalid when required root missing', () => {
    const result = validateAll(miniFlow, {});
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'root_q')).toBe(true);
  });

  it('invalid when reachable child missing', () => {
    const answers = { root_q: ['a'] }; // child is reachable but unanswered
    const result = validateAll(miniFlow, answers);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'child_q')).toBe(true);
  });

  it('valid when unreachable child is unanswered', () => {
    const answers = { root_q: ['b'] }; // child not reachable (stacks doesn't contain 'a')
    const result = validateAll(miniFlow, answers);
    expect(result.valid).toBe(true);
  });
});
