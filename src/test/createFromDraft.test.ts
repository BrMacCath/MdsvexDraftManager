// The checks from
import * as vscode from 'vscode';
import * as assert from 'assert';
import { updateFrontmatter } from '../functions/frontmatter/updateFrontmatter';
import createDraft from '../functions/drafts/createDraft';
import { createFromDraft } from '../functions/drafts/createFromDraft';

const origContent =String.raw`---
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

const newDraftWithTopicWithComments= String.raw`---
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

const newDraftWithTopicNoComments= String.raw`---
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

const newDraftNoTopicWithComments= String.raw`---
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

const newDraftNoTopicNoComments= String.raw`---
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



suite('Create draft function checks',()=>{
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
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    });
    

    test("Frontmatter changed correctly",async()=>{
        const doc = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: '---\ndraftNum: 3\ntestProperty: here\n---\nBody text',
        });
        await vscode.window.showTextDocument(doc);
        
        const [secondDraft,_] = updateFrontmatter();
        assert.ok(secondDraft.includes('draftNum: 4'));
        assert.ok(secondDraft.includes('completeSection: \"## Complete Third Draft\"') );
        assert.ok(secondDraft.includes('testProperty: here'));
    });
    // Have a test where you put content through the create draft function
    // with different settings conditions.
    test("Check create from Draft will make a new draft. Have Topic Frontmatter, have comments",async()=>{
            const doc = await vscode.workspace.openTextDocument({
                language: 'markdown',
                content: '---\ndraftNum: 2\n---',
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
            await vscode.commands.executeCommand('mdsvex-markdown-draft-manager.updateMarkdownDraft');
            const newDraft = doc.getText();
            assert.deepStrictEqual(
                newDraft.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";}),
                newDraftWithTopicWithComments.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";})
            );
        });
    
    
        test("Check create Draft will make a new draft. Have Topic Frontmatter, no comments",async()=>{
            const doc = await vscode.workspace.openTextDocument({
                language: 'markdown',
                content: '---\ndraftNum: 2\n---',
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

        test("Check create from Draft will make a new draft. Have Topic Frontmatter, no comments",async()=>{
            const doc = await vscode.workspace.openTextDocument({
                language: 'markdown',
                content: '---\ndraftNum: 2\n---',
            });
            await vscode.window.showTextDocument(doc);
            await config.update(keyHaveTopicFrontmatter, true, vscode.ConfigurationTarget.Global);
            await config.update(keyHaveComments, false, vscode.ConfigurationTarget.Global);
            const newDraft = createFromDraft(origContent,2);
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
            await vscode.commands.executeCommand('mdsvex-markdown-draft-manager.updateMarkdownDraft');
            const newDraft = doc.getText();
            assert.deepStrictEqual(
                newDraft.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";}),
                newDraftWithTopicNoComments.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";})
            );
        });
    
        test("Check create from Draft will make a new draft. No Topic Frontmatter, have comments",async()=>{
            const doc = await vscode.workspace.openTextDocument({
                language: 'markdown',
                content: '---\ndraftNum: 2\n---',
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
            await vscode.commands.executeCommand('mdsvex-markdown-draft-manager.updateMarkdownDraft');
            const newDraft = doc.getText();
           assert.deepStrictEqual(
                newDraft.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";}),
                newDraftNoTopicWithComments.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";})
            );
        });
    
        test("Check create from Draft will make a new draft. No Topic Frontmatter or comments",async()=>{
            const doc = await vscode.workspace.openTextDocument({
                language: 'markdown',
                content: '---\ndraftNum: 2\n---',
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
            await vscode.commands.executeCommand('mdsvex-markdown-draft-manager.updateMarkdownDraft');
            const newDraft = doc.getText();
            assert.deepStrictEqual(
                newDraft.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";}),
                newDraftNoTopicNoComments.trim().split('\n').map((t)=>{return t.trim();}).filter((t)=>{return t!== "";})
            );
        }); 
});