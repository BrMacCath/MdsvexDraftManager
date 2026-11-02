import * as vscode from 'vscode';
import YAML from "yaml";
import { createCompleteDraftTitle } from '../drafts/createCompleteDraftTitle';
// The function does not work well with the first draft. Go through this again.

// Strip --- above and below.
export function updateFrontmatter():[string,number]{
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== "markdown") {return ["",0];}
        const doc = editor.document;
        const m = doc.getText().match(/^---\r?\n([\s\S]*?)\r?\n---(?=\r?\n|$)/);
        if (!m) {return ["",0];} // no frontmatter
        
        const draftNumIndicator = vscode.workspace.getConfiguration('myExtension').get<string>('frontmatter.draftNumIndicator',"draftNum");
        const completeSectionIndicator = vscode.workspace.getConfiguration('myExtension').get<string>('frontmatter.completeSectionIndicator',"completeSection");
        const ydoc = YAML.parseDocument(m[1]);
        const draftNum = ydoc.get(draftNumIndicator);
        if( typeof draftNum !== "number"){
            return ["",0];
        }
        ydoc.set(draftNumIndicator,draftNum+1);
        ydoc.set(completeSectionIndicator, createCompleteDraftTitle(draftNum));
        const fm = ydoc.toString().trimEnd();
        const eol = doc.eol === vscode.EndOfLine.CRLF ? "\r\n" : "\n";
        const replacement = `---${eol}${fm}${eol}---`;
    
        return [replacement,draftNum];
}