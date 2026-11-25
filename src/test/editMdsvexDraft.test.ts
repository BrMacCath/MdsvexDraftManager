import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import * as sinon from 'sinon';

const COMMAND = 'mdsvex-draft-manager.useMdsvexTemplate'; // your command id
const OUTPUT_NAME = '+page.svx';

suite('Use Mdsvex template command', () => {
  let dir: string;

  const write = (name: string, content: string) =>
    fs.writeFile(path.join(dir, name), content, 'utf8');
  const read = (name: string) => fs.readFile(path.join(dir, name), 'utf8');

  async function runOn(name: string) {
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
    await write(
      'draft.md',
      '---\ncompleteSection: "## Done"\n---\n# Draft\nnope\n## Done\nyes\n# Next\nnope'
    );
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
  test('Gives a warning if the editor is closed',async()=>{
      await vscode.commands.executeCommand('workbench.action.closeAllEditors');
      const warn = sinon.stub(vscode.window, 'showWarningMessage');
      try {
          const result = await vscode.commands.executeCommand('mdsvex-draft-manager.useMdsvexTemplate');
          assert.strictEqual(result, undefined);
          assert.ok(warn.calledOnceWith('No file is currently open.'));
      } finally {
          warn.restore();
      }
  });
  test('Recognises not to run on non-svx files', async()=>{
    write("test.txt", 'Sample Text here');

    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(path.join(dir, "test.txt")));
    await vscode.window.showTextDocument(doc);
    const info = sinon.stub(vscode.window, 'showInformationMessage');
    try {
        const result = await vscode.commands.executeCommand('mdsvex-draft-manager.useMdsvexTemplate');
        assert.strictEqual(result, undefined);
        assert.ok(info.calledOnceWith('The current file is not markdown or mdsvex.'));
    } finally {
        info.restore();
    }
  });
});