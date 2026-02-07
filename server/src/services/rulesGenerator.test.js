import { describe, it, expect } from 'vitest';
import { generateRules } from './rulesGenerator.js';

describe('rulesGenerator', () => {
  describe('generateRules', () => {
    it('returns fallback content and filename when snippetKeys is empty', async () => {
      const result = await generateRules({ snippetKeys: [], format: 'cursor' });
      expect(result.content).toContain('No rules selected');
      expect(result.filename).toBe('rules.md');
    });

    it('includes base snippet content when base key is requested', async () => {
      const result = await generateRules({ snippetKeys: ['base'], format: 'cursor' });
      expect(result.content).toContain('Base rules');
      expect(result.content).toContain('Follow existing project structure');
      expect(result.filename).toBe('rules.md');
    });

    it('returns claude filename for claude format', async () => {
      const result = await generateRules({ snippetKeys: ['base'], format: 'claude' });
      expect(result.filename).toBe('claude.md');
    });

    it('returns generic filename for generic format', async () => {
      const result = await generateRules({ snippetKeys: ['base'], format: 'generic' });
      expect(result.filename).toBe('rules.md');
    });

    it('concatenates multiple snippets with separator', async () => {
      const result = await generateRules({
        snippetKeys: ['base', 'react'],
        format: 'cursor',
      });
      expect(result.content).toContain('Base rules');
      expect(result.content).toContain('---');
      expect(result.content).toContain('React');
    });

    it('skips unknown keys without throwing', async () => {
      const result = await generateRules({
        snippetKeys: ['base', 'nonexistent-key'],
        format: 'cursor',
      });
      expect(result.content).toContain('Base rules');
    });
  });
});
