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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// The checks from
const vscode = __importStar(require("vscode"));
const assert = __importStar(require("assert"));
const updateFrontmatter_1 = require("../functions/frontmatter/updateFrontmatter");
const createDraft_1 = __importDefault(require("../functions/drafts/createDraft"));
const origContent = String.raw `---
draftNum: 2
---

# Second Draft

+---+
Test Here. Got to this point
*---*
This is the content for the first draft
* 
> This content is here for the second draft

 We will see how it works out
* 
> We will see its effect here

+---+
Is this taken here
*---*
I need a second paragraph to test things out
* 
> Lets see how the second paragraph is working

 This will check the paragraph separating condition
* 
> Will the separating conditions work
 `;
const newDraftWithTopicWithComments = String.raw `---
draftNum: 3
completeSection: "## Complete Second Draft"
---
# Second Draft

+---+
Test Here. Got to this point
*---*
This is the content for the first draft
* 
> This content is here for the second draft

 We will see how it works out
* 
> We will see its effect here

+---+
Is this taken here
*---*
I need a second paragraph to test things out
* 
> Lets see how the second paragraph is working

 This will check the paragraph separating condition
* 
> Will the separating conditions work

## Complete Second Draft

This content is here for the second draft. We will see its effect here.

Lets see how the second paragraph is working. Will the separating conditions work.

# Third Draft

Test Here. Got to this point

*---*
This content is here for the second draft
* 
> 

We will see its effect here
* 
> 

+---+
Is this taken here

*---*
Lets see how the second paragraph is working
* 
> 

Will the separating conditions work
* 
> `;
const newDraftWithTopicNoComments = String.raw `---
draftNum: 3
completeSection: "## Complete Second Draft"
---
# Second Draft

+---+
Test Here. Got to this point
*---*
This is the content for the first draft
* 
> This content is here for the second draft

 We will see how it works out
* 
> We will see its effect here

+---+
Is this taken here
*---*
I need a second paragraph to test things out
* 
> Lets see how the second paragraph is working

 This will check the paragraph separating condition
* 
> Will the separating conditions work

## Complete Second Draft

This content is here for the second draft. We will see its effect here.

Lets see how the second paragraph is working. Will the separating conditions work.

# Third Draft

Test Here. Got to this point

*---*
This content is here for the second draft
> 

We will see its effect here
> 

+---+
Is this taken here

*---*
Lets see how the second paragraph is working
> 

Will the separating conditions work
> 
`;
const newDraftNoTopicWithComments = String.raw `---
draftNum: 3
completeSection: "## Complete Second Draft"
---
# Second Draft

+---+
Test Here. Got to this point
*---*
This is the content for the first draft
* 
> This content is here for the second draft

 We will see how it works out
* 
> We will see its effect here

+---+
Is this taken here
*---*
I need a second paragraph to test things out
* 
> Lets see how the second paragraph is working

 This will check the paragraph separating condition
* 
> Will the separating conditions work

## Complete Second Draft

This content is here for the second draft. We will see its effect here.

Lets see how the second paragraph is working. Will the separating conditions work.

# Third Draft


This content is here for the second draft
* 
> 

We will see its effect here
* 
> 

+---+

Lets see how the second paragraph is working
* 
> 

Will the separating conditions work
* 
> 
`;
const newDraftNoTopicNoComments = String.raw `---
draftNum: 3
completeSection: "## Complete Second Draft"
---
# Second Draft

+---+
Test Here. Got to this point
*---*
This is the content for the first draft
* 
> This content is here for the second draft

 We will see how it works out
* 
> We will see its effect here

+---+
Is this taken here
*---*
I need a second paragraph to test things out
* 
> Lets see how the second paragraph is working

 This will check the paragraph separating condition
* 
> Will the separating conditions work

## Complete Second Draft

This content is here for the second draft. We will see its effect here.

Lets see how the second paragraph is working. Will the separating conditions work.

# Third Draft


This content is here for the second draft
> 

We will see its effect here
> 

+---+

Lets see how the second paragraph is working
> 

Will the separating conditions work
> 
`;
suite('Create draft function checks', () => {
    const config = vscode.workspace.getConfiguration('myExtension');
    const keyHaveTopicFrontmatter = "draftStyle.haveTopicFrontmatterSeparator";
    const keyHaveComments = "draftStyle.haveLineComments";
    let originalHaveTopicFrontmatter;
    let originalHaveComments;
    setup(() => {
        // inspect() tells you what is set at each level, not just the effective value
        originalHaveTopicFrontmatter = config.inspect(keyHaveTopicFrontmatter)?.globalValue;
        originalHaveComments = config.inspect(keyHaveComments)?.globalValue;
    });
    teardown(async () => {
        // passing undefined removes the setting from that level
        await config
            .update(keyHaveTopicFrontmatter, originalHaveTopicFrontmatter, vscode.ConfigurationTarget.Global);
        await config
            .update(keyHaveComments, originalHaveComments, vscode.ConfigurationTarget.Global);
    });
    test("Frontmatter changed correctly", async () => {
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: '---\ndraftNum: 3\ntestProperty: here\n---\nBody text',
        });
        await vscode.window.showTextDocument(doc);
        const [secondDraft, _] = (0, updateFrontmatter_1.updateFrontmatter)();
        assert.ok(secondDraft.includes('draftNum: 4'));
        assert.ok(secondDraft.includes('completeSection: \"## Complete Third Draft\"'));
        assert.ok(secondDraft.includes('testProperty: here'));
    });
    // Have a test where you put content through the create draft function
    // with different settings conditions.
    test("Check create from Draft will make a new draft. Have Topic Frontmatter, have comments", async () => {
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: '---\ndraftNum: 2\n---',
        });
        await vscode.window.showTextDocument(doc);
        await config.update(keyHaveTopicFrontmatter, true, vscode.ConfigurationTarget.Global);
        await config.update(keyHaveComments, true, vscode.ConfigurationTarget.Global);
        const newDraft = (0, createDraft_1.default)(origContent);
        assert.deepStrictEqual(newDraft.trim().split('\n').map((t) => { return t.trim(); }).filter((t) => { return t !== ""; }), newDraftWithTopicWithComments.trim().split('\n').map((t) => { return t.trim(); }).filter((t) => { return t !== ""; }));
    });
    test("Check exeuting a command on a new Draft. Have Topic Frontmatter, have comments", async () => {
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: origContent,
        });
        await vscode.window.showTextDocument(doc);
        await config.update(keyHaveTopicFrontmatter, true, vscode.ConfigurationTarget.Global);
        await config.update(keyHaveComments, true, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('markdown-draft-manager.updateMarkdownDraft');
        const newDraft = doc.getText();
        assert.deepStrictEqual(newDraft.trim().split('\n').map((t) => { return t.trim(); }).filter((t) => { return t !== ""; }), newDraftWithTopicWithComments.trim().split('\n').map((t) => { return t.trim(); }).filter((t) => { return t !== ""; }));
    });
    test("Check create from Draft will make a new draft. Have Topic Frontmatter, no comments", async () => {
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: '---\ndraftNum: 2\n---',
        });
        await vscode.window.showTextDocument(doc);
        await config.update(keyHaveTopicFrontmatter, true, vscode.ConfigurationTarget.Global);
        await config.update(keyHaveComments, false, vscode.ConfigurationTarget.Global);
        const newDraft = (0, createDraft_1.default)(origContent);
        assert.deepStrictEqual(newDraft.trim().split('\n').map((t) => { return t.trim(); }).filter((t) => { return t !== ""; }), newDraftWithTopicNoComments.trim().split('\n').map((t) => { return t.trim(); }).filter((t) => { return t !== ""; }));
    });
    test("Check execute command will make a new draft. Have Topic Frontmatter, no comments", async () => {
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: origContent,
        });
        await vscode.window.showTextDocument(doc);
        await config.update(keyHaveTopicFrontmatter, true, vscode.ConfigurationTarget.Global);
        await config.update(keyHaveComments, false, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('markdown-draft-manager.updateMarkdownDraft');
        const newDraft = doc.getText();
        assert.deepStrictEqual(newDraft.trim().split('\n').map((t) => { return t.trim(); }).filter((t) => { return t !== ""; }), newDraftWithTopicNoComments.trim().split('\n').map((t) => { return t.trim(); }).filter((t) => { return t !== ""; }));
    });
    test("Check create from Draft will make a new draft. No Topic Frontmatter, have comments", async () => {
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: '---\ndraftNum: 2\n---',
        });
        await vscode.window.showTextDocument(doc);
        await config.update(keyHaveTopicFrontmatter, false, vscode.ConfigurationTarget.Global);
        await config.update(keyHaveComments, true, vscode.ConfigurationTarget.Global);
        const newDraft = (0, createDraft_1.default)(origContent);
        assert.deepStrictEqual(newDraft.trim().split('\n').map((t) => { return t.trim(); }).filter((t) => { return t !== ""; }), newDraftNoTopicWithComments.trim().split('\n').map((t) => { return t.trim(); }).filter((t) => { return t !== ""; }));
    });
    test("Check executing on a new draft. No Topic Frontmatter, have comments", async () => {
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: origContent,
        });
        await vscode.window.showTextDocument(doc);
        await config.update(keyHaveTopicFrontmatter, false, vscode.ConfigurationTarget.Global);
        await config.update(keyHaveComments, true, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('markdown-draft-manager.updateMarkdownDraft');
        const newDraft = doc.getText();
        assert.deepStrictEqual(newDraft.trim().split('\n').map((t) => { return t.trim(); }).filter((t) => { return t !== ""; }), newDraftNoTopicWithComments.trim().split('\n').map((t) => { return t.trim(); }).filter((t) => { return t !== ""; }));
    });
    test("Check create from Draft will make a new draft. No Topic Frontmatter or comments", async () => {
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: '---\ndraftNum: 2\n---',
        });
        await vscode.window.showTextDocument(doc);
        await config.update(keyHaveTopicFrontmatter, false, vscode.ConfigurationTarget.Global);
        await config.update(keyHaveComments, false, vscode.ConfigurationTarget.Global);
        const newDraft = (0, createDraft_1.default)(origContent);
        assert.deepStrictEqual(newDraft.trim().split('\n').map((t) => { return t.trim(); }).filter((t) => { return t !== ""; }), newDraftNoTopicNoComments.trim().split('\n').map((t) => { return t.trim(); }).filter((t) => { return t !== ""; }));
    });
    test("Check create from Draft will make a new draft. No Topic Frontmatter or comments", async () => {
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: origContent,
        });
        await vscode.window.showTextDocument(doc);
        await config.update(keyHaveTopicFrontmatter, false, vscode.ConfigurationTarget.Global);
        await config.update(keyHaveComments, false, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('markdown-draft-manager.updateMarkdownDraft');
        const newDraft = doc.getText();
        assert.deepStrictEqual(newDraft.trim().split('\n').map((t) => { return t.trim(); }).filter((t) => { return t !== ""; }), newDraftNoTopicNoComments.trim().split('\n').map((t) => { return t.trim(); }).filter((t) => { return t !== ""; }));
    });
});
//# sourceMappingURL=createFromDraft.test.js.map