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
const assert = __importStar(require("assert"));
const vscode = __importStar(require("vscode"));
suite('Configuration tests', () => {
    const section = 'myExtension';
    const key = 'frontmatter.draftNumIndicator';
    let original;
    setup(async () => {
        const config = vscode.workspace.getConfiguration(section);
        // inspect() tells us whether the user explicitly set a value at the global level
        original = config.inspect(key)?.globalValue;
    });
    teardown(async () => {
        const config = vscode.workspace.getConfiguration(section);
        // Passing undefined removes the override and restores the default
        await config.update(key, original, vscode.ConfigurationTarget.Global);
    });
    test('default value is draftNum', () => {
        const config = vscode.workspace.getConfiguration(section);
        assert.strictEqual(config.get(key), 'draftNum');
    });
    test('reads a changed value', async () => {
        const config = vscode.workspace.getConfiguration(section);
        await config.update(key, 'draft', vscode.ConfigurationTarget.Global);
        // Re-fetch the configuration after updating
        const updated = vscode.workspace.getConfiguration(section);
        assert.strictEqual(updated.get(key), 'draft');
    });
    test('fires onDidChangeConfiguration', async () => {
        const changed = new Promise(resolve => {
            const sub = vscode.workspace.onDidChangeConfiguration(e => {
                if (e.affectsConfiguration('myExtension.frontmatter.draftNumIndicator')) {
                    sub.dispose();
                    resolve(true);
                }
            });
        });
        await vscode.workspace
            .getConfiguration(section)
            .update(key, 'revision', vscode.ConfigurationTarget.Global);
        assert.strictEqual(await changed, true);
    });
    test('command uses the configured key', async () => {
        const config = vscode.workspace.getConfiguration('myExtension');
        await config.update('frontmatter.draftNumIndicator', 'revision', vscode.ConfigurationTarget.Global);
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: '---\nrevision: 1\n---\nBody text',
        });
        await vscode.window.showTextDocument(doc);
        await vscode.commands.executeCommand('markdown-draft-manager.updateMarkdownDraft');
        assert.ok(doc.getText().includes('revision: 2'));
    });
});
//# sourceMappingURL=draftNumIndicator.test.js.map