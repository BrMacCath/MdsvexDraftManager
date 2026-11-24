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
const fs = __importStar(require("fs/promises"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const COMMAND = 'mdsvex-draft-manager.useMdsvexTemplate'; // your command id
const OUTPUT_NAME = '+page.svx';
suite('Use Mdsvex template command', () => {
    let dir;
    const write = (name, content) => fs.writeFile(path.join(dir, name), content, 'utf8');
    const read = (name) => fs.readFile(path.join(dir, name), 'utf8');
    async function runOn(name) {
        const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(path.join(dir, name)));
        await vscode.window.showTextDocument(doc);
        await vscode.commands.executeCommand(COMMAND);
    }
    setup(async () => {
        dir = await fs.mkdtemp(path.join(os.tmpdir(), 'inline-test-'));
    });
    teardown(async () => {
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');
        await fs.rm(dir, { recursive: true, force: true });
    });
    test('inlines a whole sibling file', async () => {
        await write('part.md', 'Hello from part');
        await write('main.md', 'Start\n{{ part.md }}\nEnd');
        await runOn('main.md');
        assert.strictEqual(await read(OUTPUT_NAME), 'Start\nHello from part\nEnd');
    });
    test('inlines only the completeSection', async () => {
        await write('draft.md', '---\ncompleteSection: "## Done"\n---\n# Draft\nnope\n## Done\nyes\n# Next\nnope');
        await write('main.md', 'A {{draft.md}} B');
        await runOn('main.md');
        assert.strictEqual(await read(OUTPUT_NAME), 'A yes B');
    });
    test('handles the same placeholder more than once', async () => {
        await write('x.md', 'X');
        await write('main.md', '{{ x.md }}-{{ x.md }}');
        await runOn('main.md');
        assert.strictEqual(await read(OUTPUT_NAME), 'X-X');
    });
    test('leaves unresolved placeholders untouched', async () => {
        await write('main.md', 'Before {{ missing.md }} after');
        await runOn('main.md');
        assert.strictEqual(await read(OUTPUT_NAME), 'Before {{ missing.md }} after');
    });
    test('does not modify the source file', async () => {
        await write('part.md', 'P');
        const source = 'Keep {{ part.md }} as is';
        await write('main.md', source);
        await runOn('main.md');
        assert.strictEqual(await read('main.md'), source);
    });
    test('overwrites an existing output file', async () => {
        await write(OUTPUT_NAME, 'old stale content');
        await write('part.md', 'fresh');
        await write('main.md', '{{ part.md }}');
        await runOn('main.md');
        assert.strictEqual(await read(OUTPUT_NAME), 'fresh');
    });
    test('refuses to run when the active file is the output file', async () => {
        await write(OUTPUT_NAME, 'original {{ nothing.md }}');
        await runOn(OUTPUT_NAME);
        assert.strictEqual(await read(OUTPUT_NAME), 'original {{ nothing.md }}');
    });
});
//# sourceMappingURL=editMdsvexDraft.test.js.map