// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import createDraft from './functions/drafts/createDraft';

function extractCompleteSection(content: string): string | undefined {
  // Frontmatter must be at the very start of the file
  const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  if (!fm) { return content; }

  // Pull out completeSection: "## Heading" (quotes optional)
  const heading = fm[1].match(/^completeSection:\s*["']?(.+?)["']?\s*$/m)?.[1].trim();
  if (!heading) { return content; } // no completeSection key: use the whole file

  const level = heading.match(/^#+/)?.[0].length;
  if (!level) { return undefined; } // value isn't a markdown heading

  const lines = content.slice(fm[0].length).split(/\r?\n/);

  let start = -1;
  let end = lines.length;
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Ignore "#" lines inside code blocks
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) { continue; }

    if (start === -1) {
      if (line.trim() === heading) { start = i + 1; }
    } else {
      // Next heading of same or higher level (fewer or equal #s) ends the section
      const m = line.match(/^(#{1,6})\s/);
      if (m && m[1].length <= level) {
        end = i;
        break;
      }
    }
  }

  if (start === -1) { return undefined; } // heading not found
  return lines.slice(start, end).join('\n').trim();
}

async function readSibling(dir: vscode.Uri, name: string): Promise<string | undefined> {
  try {
    const fileUri = vscode.Uri.joinPath(dir, name);
    const bytes = await vscode.workspace.fs.readFile(fileUri);
    const text = new TextDecoder('utf-8').decode(bytes);
    return extractCompleteSection(text);
  } catch {
    return undefined; // file missing or unreadable
  }
}

const OUTPUT_NAME = '+page.svx'; // change to whatever you want

export function activate(context: vscode.ExtensionContext) {

	const supportedLanguages = ['markdown', 'mdsvex'];
	// Command to update a markdown file 
	// First we ensure it is a md file and then edit with
	// new draft from new draft function.
	const updateDraftCommand = vscode.commands.registerCommand('mdsvex-markdown-draft-manager.updateMarkdownDraft', async () => {

		const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showWarningMessage('No file is currently open.');
			return;
		}

		const document: vscode.TextDocument = editor.document;

		if (document.languageId !== 'markdown') {
			vscode.window.showInformationMessage('The current file is not markdown.');
			return;
		}

		const newDraft = createDraft(document.getText());

		const fullRange = new vscode.Range(
			document.positionAt(0),
			document.positionAt(document.getText().length)
		);

		const success = await editor.edit(editBuilder => {
			editBuilder.replace(fullRange, newDraft);
		});

		if (!success) {
			vscode.window.showErrorMessage('Failed to edit the document.');
		}
	});

	// This command will take a draft mdsvex file and fill in portions from other markdown files.

	const fillInMdSvex = vscode.commands.registerCommand('mdsvex-markdown-draft-manager.editMdsvex', async () => {

		const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showWarningMessage('No file is currently open.');
			return;
		}

		const document: vscode.TextDocument = editor.document;

		const isSvx = document.fileName.endsWith('.svx');

		if (!supportedLanguages.includes(document.languageId) && !isSvx) {
			vscode.window.showInformationMessage('The current file is not markdown or mdsvex.');
			return;
		}

	if (!editor) { return; }

	const text = document.getText();
	const regex = /\{\{\s*([\w./-]+)\s*\}\}/g;

	// Folder containing the current file
	const dir = vscode.Uri.joinPath(document.uri, '..');
	const outputUri = vscode.Uri.joinPath(dir, OUTPUT_NAME);
	const matches = [...text.matchAll(regex)];

	// Read each unique file once
	const uniqueNames = [...new Set(matches.map(m => m[1]))];
	const contents = new Map<string, string | undefined>();
	await Promise.all(
		uniqueNames.map(async name => contents.set(name, await readSibling(dir, name)))
	);

	const missing: string[] = [];
  	const result = text.replace(regex, (full, name) => {
    const replacement = contents.get(name);
    if (replacement === undefined) {
      missing.push(name);
      return full;
    }
    return replacement;
  	});

	await vscode.workspace.fs.writeFile(outputUri, new TextEncoder().encode(result));

		
	});

  context.subscriptions.push(updateDraftCommand,fillInMdSvex);
}

// This method is called when your extension is deactivated
export function deactivate() {}
