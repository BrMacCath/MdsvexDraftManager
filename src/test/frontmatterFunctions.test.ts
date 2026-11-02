// Tests to ensure frontmatter functions are working.

import * as assert from 'assert';
import * as vscode from 'vscode';

import { removeFrontMatter } from '../functions/frontmatter/removeFrontMatter';
import { frontMatterIndicator } from '../constants/frontMatterConstants';
import { extractFrontMatter } from '../functions/frontmatter/extractFrontMatter';
import { updateFrontmatter } from '../functions/frontmatter/updateFrontmatter';

// Tests how it removes frontmatter. Here is some test data
suite('Test frontmatter functions',() =>{

    const testFrontmatter ="---\ncomplete: false\ndraftNum: 4\n---\n";
    const testContent = "This is test content. This is here";
    const testFrontmatterArray:[boolean,[string,string][]] = [true,[["complete","false"], ['draftNum','4'] ]];
    // Here we test the remove frontmatter functions.

    teardown(async () => {
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    });

    test("removeFrontMatter removes frontmatter",()=>{
        const testText = testFrontmatter+testContent;
        assert.strictEqual(removeFrontMatter(testText),testContent);
    });

    test("removeFrontMatter does nothing on files without frontmatter",()=>{
        assert.strictEqual(removeFrontMatter(testContent),testContent);
    });

    test("removeFrontMatter does nothing on files without an end Indicator",()=>{
        const testText = frontMatterIndicator + testContent;
        assert.strictEqual(removeFrontMatter(testText),testText);
    });

    const failExtractFrontMatter: [boolean,[string,string][]] = [false,[]];

    // Here we test the extract frontmatter functions.
    test("extractFrontMatter extracts frontmatter",()=>{
        const testText = testFrontmatter+testContent;
        assert.deepStrictEqual(extractFrontMatter(testText),testFrontmatterArray);
    });

    test("extractFrontMatter fails file without frontmatter",()=>{
        assert.deepStrictEqual(extractFrontMatter(testContent),failExtractFrontMatter);
    });

    test('no active editor returns ["", 0]', async () => {
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');

        assert.strictEqual(vscode.window.activeTextEditor, undefined);
        assert.deepStrictEqual(updateFrontmatter(), ['', 0]);
    });

    test('empty editor that is not markdown returns ["", 0]', async () => {
        const doc = await vscode.workspace.openTextDocument({
            language: 'plaintext',
            content: '',
        });
        await vscode.window.showTextDocument(doc);

        assert.deepStrictEqual(updateFrontmatter(), ['', 0]);
    });
    
    test('editor with frontmatter but no draftNum returns ["", 0]', async () => {
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: '---\ntitle: hello\n---',
        });
        await vscode.window.showTextDocument(doc);

        assert.deepStrictEqual(updateFrontmatter(), ['', 0]);
    });
});