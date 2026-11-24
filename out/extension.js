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
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const createDraft_1 = __importDefault(require("./functions/drafts/createDraft"));
const extractCompleteSection_1 = require("./functions/extraction/extractCompleteSection");
async function readSibling(dir, name) {
    try {
        const fileUri = vscode.Uri.joinPath(dir, name);
        const bytes = await vscode.workspace.fs.readFile(fileUri);
        const text = new TextDecoder('utf-8').decode(bytes);
        return (0, extractCompleteSection_1.extractCompleteSection)(text);
    }
    catch {
        return undefined; // file missing or unreadable
    }
}
const OUTPUT_NAME = '+page.svx'; // change to whatever you want
function activate(context) {
    const supportedLanguages = ['markdown', 'mdsvex'];
    // Command to update a markdown file 
    // First we ensure it is a md file and then edit with
    // new draft from new draft function.
    const updateDraftCommand = vscode.commands.registerCommand('mdsvex-draft-manager.updateMarkdownDraft', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No file is currently open.');
            return;
        }
        const document = editor.document;
        if (document.languageId !== 'markdown') {
            vscode.window.showInformationMessage('The current file is not markdown.');
            return;
        }
        const newDraft = (0, createDraft_1.default)(document.getText());
        const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));
        const success = await editor.edit(editBuilder => {
            editBuilder.replace(fullRange, newDraft);
        });
        if (!success) {
            vscode.window.showErrorMessage('Failed to edit the document.');
        }
    });
    // This command will take a draft mdsvex file and fill in portions from other markdown files.
    const fillInMdSvex = vscode.commands.registerCommand('mdsvex-draft-manager.useMdsvexTemplate', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No file is currently open.');
            return;
        }
        const document = editor.document;
        const isSvx = document.fileName.endsWith('.svx');
        if (!supportedLanguages.includes(document.languageId) && !isSvx) {
            vscode.window.showInformationMessage('The current file is not markdown or mdsvex.');
            return;
        }
        if (!editor) {
            return;
        }
        const text = document.getText();
        const regex = /\{\{\s*([\w./-]+)\s*\}\}/g;
        // Folder containing the current file
        const dir = vscode.Uri.joinPath(document.uri, '..');
        const outputUri = vscode.Uri.joinPath(dir, OUTPUT_NAME);
        const matches = [...text.matchAll(regex)];
        // Read each unique file once
        const uniqueNames = [...new Set(matches.map(m => m[1]))];
        const contents = new Map();
        await Promise.all(uniqueNames.map(async (name) => contents.set(name, await readSibling(dir, name))));
        const missing = [];
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
    context.subscriptions.push(updateDraftCommand, fillInMdSvex);
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map