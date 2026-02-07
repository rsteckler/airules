import { describe, it, expect } from 'vitest';
import { runAgentFlow } from './agentFlow.js';

describe('agentFlow', () => {
  describe('runAgentFlow', () => {
    it('returns base and cursor format when answers is null', () => {
      const result = runAgentFlow(null);
      expect(result.snippetKeys).toEqual(['base']);
      expect(result.format).toBe('cursor');
    });

    it('returns cursor format for any answers', () => {
      const result = runAgentFlow({ stacks: ['web'] });
      expect(result.format).toBe('cursor');
    });

    it('returns baseContent for process answers', () => {
      const result = runAgentFlow({
        stacks: ['web'],
        ai_permissions: ['create_files', 'edit_files'],
        git_behavior: 'push_when_asked',
      });
      expect(result).toHaveProperty('baseContent');
      expect(typeof result.baseContent).toBe('string');
    });

    it('selects snippets via tag query', () => {
      const result = runAgentFlow({
        stacks: ['web', 'tests'],
        web_language: ['typescript'],
        web_frameworks: ['react'],
        testing_tools: ['vitest'],
      });
      expect(result.snippetKeys).toBeDefined();
      expect(Array.isArray(result.snippetKeys)).toBe(true);
    });
  });
});
