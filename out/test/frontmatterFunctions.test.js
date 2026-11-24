"use strict";
// Tests to ensure frontmatter functions are working.
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
const assert = __importStar(require("assert"));
const vscode = __importStar(require("vscode"));
const removeFrontMatter_1 = require("../functions/frontmatter/removeFrontMatter");
const frontMatterConstants_1 = require("../constants/frontMatterConstants");
const extractFrontMatter_1 = require("../functions/frontmatter/extractFrontMatter");
const updateFrontmatter_1 = require("../functions/frontmatter/updateFrontmatter");
// Tests how it removes frontmatter. Here is some test data
suite('Test frontmatter functions', () => {
    const testFrontmatter = "---\ncomplete: false\ndraftNum: 4\n---\n";
    const testContent = "This is test content. This is here";
    const testFrontmatterArray = [true, [["complete", "false"], ['draftNum', '4']]];
    // Here we test the remove frontmatter functions.
    teardown(async () => {
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    });
    test("removeFrontMatter removes frontmatter", () => {
        const testText = testFrontmatter + testContent;
        assert.strictEqual((0, removeFrontMatter_1.removeFrontMatter)(testText), testContent);
    });
    test("removeFrontMatter does nothing on files without frontmatter", () => {
        assert.strictEqual((0, removeFrontMatter_1.removeFrontMatter)(testContent), testContent);
    });
    test("removeFrontMatter does nothing on files without an end Indicator", () => {
        const testText = frontMatterConstants_1.frontMatterIndicator + testContent;
        assert.strictEqual((0, removeFrontMatter_1.removeFrontMatter)(testText), testText);
    });
    const failExtractFrontMatter = [false, []];
    // Here we test the extract frontmatter functions.
    test("extractFrontMatter extracts frontmatter", () => {
        const testText = testFrontmatter + testContent;
        assert.deepStrictEqual((0, extractFrontMatter_1.extractFrontMatter)(testText), testFrontmatterArray);
    });
    test("extractFrontMatter fails file without frontmatter", () => {
        assert.deepStrictEqual((0, extractFrontMatter_1.extractFrontMatter)(testContent), failExtractFrontMatter);
    });
    test('no active editor returns ["", 0]', async () => {
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');
        assert.strictEqual(vscode.window.activeTextEditor, undefined);
        assert.deepStrictEqual((0, updateFrontmatter_1.updateFrontmatter)(), ['', 0]);
    });
    test('empty editor that is not markdown returns ["", 0]', async () => {
        const doc = await vscode.workspace.openTextDocument({
            language: 'plaintext',
            content: '',
        });
        await vscode.window.showTextDocument(doc);
        assert.deepStrictEqual((0, updateFrontmatter_1.updateFrontmatter)(), ['', 0]);
    });
    test('empty markdown editor returns ["", 0]', async () => {
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: '',
        });
        await vscode.window.showTextDocument(doc);
        assert.deepStrictEqual((0, updateFrontmatter_1.updateFrontmatter)(), ['', 0]);
    });
    test('uses CRLF when the document uses CRLF', async () => {
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: '---\ndraftNum: 1\n---\nBody',
        });
        const editor = await vscode.window.showTextDocument(doc);
        await editor.edit((eb) => eb.setEndOfLine(vscode.EndOfLine.CRLF));
        assert.strictEqual(doc.eol, vscode.EndOfLine.CRLF);
        const [frontMatter, oldDraftNum] = (0, updateFrontmatter_1.updateFrontmatter)();
        assert.strictEqual(oldDraftNum, 1);
        assert.ok(frontMatter.includes('\r\n'));
        assert.ok(frontMatter.startsWith('---\r\n'));
        assert.ok(frontMatter.endsWith('\r\n---'));
    });
    test('editor with frontmatter but no draftNum returns ["", 0]', async () => {
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: '---\ntitle: hello\n---',
        });
        await vscode.window.showTextDocument(doc);
        assert.deepStrictEqual((0, updateFrontmatter_1.updateFrontmatter)(), ['', 0]);
    });
});
//# sourceMappingURL=frontmatterFunctions.test.js.map