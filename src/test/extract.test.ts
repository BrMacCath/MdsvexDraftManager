// src/test/extract.test.ts
import * as assert from 'assert';
import { extractCompleteSection } from '../functions/extraction/extractCompleteSection';

suite('extractCompleteSection', () => {
  const doc = [
    '---',
    'draftNum: 3',
    'completeSection: "## Complete Second Draft"',
    '---',
    '# Second Draft',
    'ignored draft text',
    '## Complete Second Draft',
    '',
    'Wanted paragraph one.',
    '',
    'Wanted paragraph two.',
    '',
    '# Third Draft',
    'ignored too',
  ].join('\n');

  test('returns only the named section', () => {
    assert.strictEqual(
      extractCompleteSection(doc),
      'Wanted paragraph one.\n\nWanted paragraph two.'
    );
  });

  test('stops at a heading of the same level', () => {
    const text = '---\ncompleteSection: "## A"\n---\n## A\nkeep\n## B\ndrop';
    assert.strictEqual(extractCompleteSection(text), 'keep');
  });

  test('includes deeper subheadings', () => {
    const text = '---\ncompleteSection: "## A"\n---\n## A\nkeep\n### Sub\nalso keep\n## B\ndrop';
    assert.strictEqual(extractCompleteSection(text), 'keep\n### Sub\nalso keep');
  });

  test('runs to end of file when no later heading', () => {
    const text = '---\ncompleteSection: "## A"\n---\n## A\nlast section';
    assert.strictEqual(extractCompleteSection(text), 'last section');
  });

  test('accepts unquoted frontmatter values', () => {
    const text = '---\ncompleteSection: ## A\n---\n## A\nkeep';
    assert.strictEqual(extractCompleteSection(text), 'keep');
  });

  test('ignores # lines inside code fences', () => {
    const text = '---\ncompleteSection: "## A"\n---\n## A\n```\n# not a heading\n```\nkeep\n## B';
    assert.strictEqual(extractCompleteSection(text), '```\n# not a heading\n```\nkeep');
  });

  test('handles CRLF line endings', () => {
    const text = '---\r\ncompleteSection: "## A"\r\n---\r\n## A\r\nkeep\r\n## B\r\ndrop';
    assert.strictEqual(extractCompleteSection(text), 'keep');
  });

  test('returns undefined when the heading is missing', () => {
    const text = '---\ncompleteSection: "## Nope"\n---\n## A\ntext';
    assert.strictEqual(extractCompleteSection(text), undefined);
  });

  test('returns undefined when the value is not a heading', () => {
    const text = '---\ncompleteSection: "Just words"\n---\n## A\ntext';
    assert.strictEqual(extractCompleteSection(text), undefined);
  });

  test('returns the whole file when there is no frontmatter', () => {
    assert.strictEqual(extractCompleteSection('# Hi\nthere'), '# Hi\nthere');
  });

  test('returns the whole file when there is no completeSection key', () => {
    const text = '---\ndraftNum: 1\n---\nbody';
    assert.strictEqual(extractCompleteSection(text), text);
  });
});