import * as vscode from 'vscode';
import * as assert from 'assert';
import * as sinon from 'sinon';

suite('Update Markdown commands tests',async()=>{
    afterEach(async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    });
    test('no active editor shows a warning', async () => {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    const warn = sinon.stub(vscode.window, 'showWarningMessage');
    try {
        const result = await vscode.commands.executeCommand('mdsvex-draft-manager.updateMarkdownDraft');
        assert.strictEqual(result, undefined);
        assert.ok(warn.calledOnceWith('No file is currently open.'));
    } finally {
        warn.restore();
    }
    });
    
    test('A non markdown language shows a warning', async () => {
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');
        const doc = await vscode.workspace.openTextDocument({
            language: 'plaintext',
            content: '---\ndraftNum: 1\ntestProperty: here\n---\nBody text',
        });
        await vscode.window.showTextDocument(doc);
        assert.strictEqual(vscode.window.activeTextEditor?.document.languageId, 'plaintext');
        const info = sinon.stub(vscode.window, 'showInformationMessage');
        try {
            const result = await vscode.commands.executeCommand('mdsvex-draft-manager.updateMarkdownDraft');
            assert.strictEqual(result, undefined);
            assert.ok(info.calledOnceWith('The current file is not markdown.'));
        } finally {
            info.restore();
        }
    });
});