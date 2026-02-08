import { describe, it, expect } from 'vitest';
import { resolveSnippets } from './agentFlow.js';

describe('agentFlow', () => {
  describe('resolveSnippets', () => {
    it('returns empty array when answers is null', () => {
      const result = resolveSnippets(null);
      expect(result).toEqual([]);
    });

    it('always includes global snippets', () => {
      const result = resolveSnippets({ stacks: ['web'] });
      expect(result[0]).toBe('default.md');
    });

    it('includes language snippets for selected web languages', () => {
      const result = resolveSnippets({
        web_language: ['typescript', 'javascript'],
      });
      expect(result).toContain('languages/typescript.md');
      expect(result).toContain('languages/javascript.md');
    });

    it('includes framework snippets for selected frameworks', () => {
      const result = resolveSnippets({
        web_frameworks: ['react'],
      });
      expect(result).toContain('frameworks/web/react.md');
    });

    it('deduplicates snippet paths across questions', () => {
      const result = resolveSnippets({
        web_language: ['typescript'],
        server_language: ['typescript'],
      });
      const tsCount = result.filter((p) => p === 'languages/typescript.md').length;
      expect(tsCount).toBe(1);
    });

    it('includes defaultSnippet for testing when a non-none tool is selected', () => {
      const result = resolveSnippets({
        testing_tools: ['vitest'],
      });
      expect(result).toContain('frameworks/testing/default.md');
      expect(result).toContain('frameworks/testing/vitest.md');
      // default should come before the specific snippet
      const defaultIdx = result.indexOf('frameworks/testing/default.md');
      const vitestIdx = result.indexOf('frameworks/testing/vitest.md');
      expect(defaultIdx).toBeLessThan(vitestIdx);
    });

    it('does not include defaultSnippet when only "none" is selected', () => {
      const result = resolveSnippets({
        testing_tools: ['none'],
      });
      expect(result).not.toContain('frameworks/testing/default.md');
    });

    it('includes permission snippets for checked permissions', () => {
      const result = resolveSnippets({
        ai_permissions: ['delete_files', 'run_app'],
      });
      expect(result).toContain('preferences/permissions/delete.md');
      expect(result).toContain('preferences/permissions/run-app.md');
    });

    it('handles single-select questions', () => {
      const result = resolveSnippets({
        git_behavior: 'git_push_when_asked',
      });
      expect(result).toContain('preferences/git/commit-only.md');
    });

    it('handles array-valued snippet mappings (e.g. typescript_javascript)', () => {
      const result = resolveSnippets({
        mobile_language: 'typescript_javascript',
      });
      expect(result).toContain('languages/typescript.md');
      expect(result).toContain('languages/javascript.md');
    });
  });
});
