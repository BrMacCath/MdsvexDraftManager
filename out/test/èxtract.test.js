"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/test/extract.test.ts
const assert = __importStar(require("assert"));
const extractCompleteSection_1 = require("../functions/extraction/extractCompleteSection");
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
        assert.strictEqual((0, extractCompleteSection_1.extractCompleteSection)(doc), 'Wanted paragraph one.\n\nWanted paragraph two.');
    });
    test('stops at a heading of the same level', () => {
        const text = '---\ncompleteSection: "## A"\n---\n## A\nkeep\n## B\ndrop';
        assert.strictEqual((0, extractCompleteSection_1.extractCompleteSection)(text), 'keep');
    });
    test('includes deeper subheadings', () => {
        const text = '---\ncompleteSection: "## A"\n---\n## A\nkeep\n### Sub\nalso keep\n## B\ndrop';
        assert.strictEqual((0, extractCompleteSection_1.extractCompleteSection)(text), 'keep\n### Sub\nalso keep');
    });
    test('runs to end of file when no later heading', () => {
        const text = '---\ncompleteSection: "## A"\n---\n## A\nlast section';
        assert.strictEqual((0, extractCompleteSection_1.extractCompleteSection)(text), 'last section');
    });
    test('accepts unquoted frontmatter values', () => {
        const text = '---\ncompleteSection: ## A\n---\n## A\nkeep';
        assert.strictEqual((0, extractCompleteSection_1.extractCompleteSection)(text), 'keep');
    });
    test('ignores # lines inside code fences', () => {
        const text = '---\ncompleteSection: "## A"\n---\n## A\n```\n# not a heading\n```\nkeep\n## B';
        assert.strictEqual((0, extractCompleteSection_1.extractCompleteSection)(text), '```\n# not a heading\n```\nkeep');
    });
    test('handles CRLF line endings', () => {
        const text = '---\r\ncompleteSection: "## A"\r\n---\r\n## A\r\nkeep\r\n## B\r\ndrop';
        assert.strictEqual((0, extractCompleteSection_1.extractCompleteSection)(text), 'keep');
    });
    test('returns undefined when the heading is missing', () => {
        const text = '---\ncompleteSection: "## Nope"\n---\n## A\ntext';
        assert.strictEqual((0, extractCompleteSection_1.extractCompleteSection)(text), undefined);
    });
    test('returns undefined when the value is not a heading', () => {
        const text = '---\ncompleteSection: "Just words"\n---\n## A\ntext';
        assert.strictEqual((0, extractCompleteSection_1.extractCompleteSection)(text), undefined);
    });
    test('returns the whole file when there is no frontmatter', () => {
        assert.strictEqual((0, extractCompleteSection_1.extractCompleteSection)('# Hi\nthere'), '# Hi\nthere');
    });
    test('returns the whole file when there is no completeSection key', () => {
        const text = '---\ndraftNum: 1\n---\nbody';
        assert.strictEqual((0, extractCompleteSection_1.extractCompleteSection)(text), text);
    });
});
//# sourceMappingURL=%C3%A8xtract.test.js.map