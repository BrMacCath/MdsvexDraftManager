import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Configuration tests', () => {
  const section = 'myExtension';
  const key = 'frontmatter.draftNumIndicator';
  let original: string | undefined;

  setup(async () => {
    const config = vscode.workspace.getConfiguration(section);
    // inspect() tells us whether the user explicitly set a value at the global level
    original = config.inspect<string>(key)?.globalValue;
  });

  teardown(async () => {
    const config = vscode.workspace.getConfiguration(section);
    // Passing undefined removes the override and restores the default
    await config.update(key, original, vscode.ConfigurationTarget.Global);
  });

  test('default value is draftNum', () => {
    const config = vscode.workspace.getConfiguration(section);
    assert.strictEqual(config.get<string>(key), 'draftNum');
  });

  test('reads a changed value', async () => {
    const config = vscode.workspace.getConfiguration(section);
    await config.update(key, 'draft', vscode.ConfigurationTarget.Global);

    // Re-fetch the configuration after updating
    const updated = vscode.workspace.getConfiguration(section);
    assert.strictEqual(updated.get<string>(key), 'draft');
  });

  test('fires onDidChangeConfiguration', async () => {
    const changed = new Promise<boolean>(resolve => {
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

    await vscode.commands.executeCommand('mdsvex-markdown-draft-manager.updateMarkdownDraft');

    assert.ok(doc.getText().includes('revision: 2'));
    });
});