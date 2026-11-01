// First Draft properties to check

// Topic Frontmatter effects

// Change in draft num

// Change in completeSectionIndicator

import * as assert from 'assert';
import { updateFrontmatter } from '../functions/frontmatter/updateFrontmatter';
import * as vscode from 'vscode';
import createDraft from '../functions/drafts/createDraft';

const origContent =String.raw`---
draftNum: 1
---

# First Draft

This is the content for the first draft. We will see how it works out.

I need a second paragraph to test things out. This will check the paragraph separating condition.`;

const newDraftWithTopicWithComments= String.raw`---
draftNum: 2
completeSection: "## Complete First Draft"
---
# First Draft

This is the content for the first draft. We will see how it works out.

I need a second paragraph to test things out. This will check the paragraph separating condition.

## Complete First Draft

This is the content for the first draft. We will see how it works out.

I need a second paragraph to test things out. This will check the paragraph separating condition.

# Second Draft

+---+

*---*
This is the content for the first draft
* 
> 

 We will see how it works out
* 
> 

+---+

*---*
I need a second paragraph to test things out
* 
> 

 This will check the paragraph separating condition
* 
> 
`;
const newDraftWithTopicNoComments= String.raw`---
draftNum: 2
completeSection: "## Complete First Draft"
---
# First Draft

This is the content for the first draft. We will see how it works out.

I need a second paragraph to test things out. This will check the paragraph separating condition.

## Complete First Draft

This is the content for the first draft. We will see how it works out.

I need a second paragraph to test things out. This will check the paragraph separating condition.

# Second Draft

+---+

*---*
This is the content for the first draft
> 

 We will see how it works out
> 

+---+

*---*
I need a second paragraph to test things out
> 

 This will check the paragraph separating condition
> 
`;

const newDraftNoTopicWithComments= String.raw`---
draftNum: 2
completeSection: "## Complete First Draft"
---
# First Draft

This is the content for the first draft. We will see how it works out.

I need a second paragraph to test things out. This will check the paragraph separating condition.

## Complete First Draft

This is the content for the first draft. We will see how it works out.

I need a second paragraph to test things out. This will check the paragraph separating condition.

# Second Draft

+---+

This is the content for the first draft
* 
> 

 We will see how it works out
* 
> 

+---+

I need a second paragraph to test things out
* 
> 

 This will check the paragraph separating condition
* 
> 
`;

const newDraftNoTopicNoComments= String.raw`---
draftNum: 2
completeSection: "## Complete First Draft"
---
# First Draft

This is the content for the first draft. We will see how it works out.

I need a second paragraph to test things out. This will check the paragraph separating condition.

## Complete First Draft

This is the content for the first draft. We will see how it works out.

I need a second paragraph to test things out. This will check the paragraph separating condition.

# Second Draft

+---+

This is the content for the first draft
> 

 We will see how it works out
> 

+---+

I need a second paragraph to test things out
> 

 This will check the paragraph separating condition
> 
`;

suite('First Draft Create function checks',()=>{
    const config = vscode.workspace.getConfiguration('myExtension');
    const keyHaveTopicFrontmatter = "draftStyle.haveTopicFrontmatterSeparator";
    const keyHaveComments = "draftStyle.haveLineComments";
    let originalHaveTopicFrontmatter: unknown;
    let originalHaveComments: unknown;

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
    

    test("Check frontmatter will update correctly",async()=>{
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: '---\ndraftNum: 1\ntestProperty: here\n---\nBody text',
        });
        await vscode.window.showTextDocument(doc);
        
        const [secondDraft,_] = updateFrontmatter();
        assert.ok(secondDraft.includes('draftNum: 2'));
        assert.ok(secondDraft.includes('completeSection: \"## Complete First Draft\"') );
        assert.ok(secondDraft.includes('testProperty: here'));
    });

    test("Check create from Draft will make a new draft. Have Topic Frontmatter, have comments",async()=>{
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: '---\ndraftNum: 1\n---',
        });
        await vscode.window.showTextDocument(doc);
        await config.update(keyHaveTopicFrontmatter, true, vscode.ConfigurationTarget.Global);
        await config.update(keyHaveComments, true, vscode.ConfigurationTarget.Global);
        const newDraft = createDraft(origContent);
        assert.deepStrictEqual(
            newDraft.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";}),
            newDraftWithTopicWithComments.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";})
        );
    });

    test("Check exeuting a command on a new Draft. Have Topic Frontmatter, have comments",async()=>{
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: origContent,
        });
        await vscode.window.showTextDocument(doc);
        await config.update(keyHaveTopicFrontmatter, true, vscode.ConfigurationTarget.Global);
        await config.update(keyHaveComments, true, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('markdown-draft-manager.updateMarkdownDraft');
        const newDraft = doc.getText();
        assert.deepStrictEqual(
            newDraft.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";}),
            newDraftWithTopicWithComments.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";})
        );
    });


    test("Check create from Draft will make a new draft. Have Topic Frontmatter, no comments",async()=>{
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: '---\ndraftNum: 1\n---',
        });
        await vscode.window.showTextDocument(doc);
        await config.update(keyHaveTopicFrontmatter, true, vscode.ConfigurationTarget.Global);
        await config.update(keyHaveComments, false, vscode.ConfigurationTarget.Global);
        const newDraft = createDraft(origContent);
        assert.deepStrictEqual(
            newDraft.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";}),
            newDraftWithTopicNoComments.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";})
        );
    });

    test("Check execute command will make a new draft. Have Topic Frontmatter, no comments",async()=>{
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: origContent,
        });
        await vscode.window.showTextDocument(doc);
        await config.update(keyHaveTopicFrontmatter, true, vscode.ConfigurationTarget.Global);
        await config.update(keyHaveComments, false, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('markdown-draft-manager.updateMarkdownDraft');
        const newDraft = doc.getText();
        assert.deepStrictEqual(
            newDraft.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";}),
            newDraftWithTopicNoComments.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";})
        );
    });

    test("Check create from Draft will make a new draft. No Topic Frontmatter, have comments",async()=>{
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: '---\ndraftNum: 1\n---',
        });
        await vscode.window.showTextDocument(doc);
        await config.update(keyHaveTopicFrontmatter, false, vscode.ConfigurationTarget.Global);
        await config.update(keyHaveComments, true, vscode.ConfigurationTarget.Global);
        const newDraft = createDraft(origContent);
       assert.deepStrictEqual(
            newDraft.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";}),
            newDraftNoTopicWithComments.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";})
        );
    });

    test("Check executing on a new draft. No Topic Frontmatter, have comments",async()=>{
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: origContent,
        });
        await vscode.window.showTextDocument(doc);
        await config.update(keyHaveTopicFrontmatter, false, vscode.ConfigurationTarget.Global);
        await config.update(keyHaveComments, true, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('markdown-draft-manager.updateMarkdownDraft');
        const newDraft = doc.getText();
       assert.deepStrictEqual(
            newDraft.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";}),
            newDraftNoTopicWithComments.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";})
        );
    });

    test("Check create from Draft will make a new draft. No Topic Frontmatter or comments",async()=>{
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: '---\ndraftNum: 1\n---',
        });
        await vscode.window.showTextDocument(doc);
        await config.update(keyHaveTopicFrontmatter, false, vscode.ConfigurationTarget.Global);
        await config.update(keyHaveComments, false, vscode.ConfigurationTarget.Global);
        const newDraft = createDraft(origContent);
       assert.deepStrictEqual(
            newDraft.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";}),
            newDraftNoTopicNoComments.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";})
        );
    });
    test("Check create from Draft will make a new draft. No Topic Frontmatter or comments",async()=>{
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: origContent,
        });
        await vscode.window.showTextDocument(doc);
        await config.update(keyHaveTopicFrontmatter, false, vscode.ConfigurationTarget.Global);
        await config.update(keyHaveComments, false, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('markdown-draft-manager.updateMarkdownDraft');
        const newDraft = doc.getText();
        assert.deepStrictEqual(
            newDraft.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";}),
            newDraftNoTopicNoComments.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";})
        );
    });
}
);