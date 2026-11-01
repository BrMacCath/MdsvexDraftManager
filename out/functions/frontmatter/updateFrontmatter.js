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
exports.updateFrontmatter = updateFrontmatter;
const vscode = __importStar(require("vscode"));
const yaml_1 = __importDefault(require("yaml"));
const createCompleteDraftTitle_1 = require("../drafts/createCompleteDraftTitle");
// The function does not work well with the first draft. Go through this again.
// Strip --- above and below.
function updateFrontmatter() {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== "markdown") {
        return ["", 0];
    }
    const doc = editor.document;
    const m = doc.getText().match(/^---\r?\n([\s\S]*?)\r?\n---(?=\r?\n|$)/);
    if (!m) {
        return ["", 0];
    } // no frontmatter
    const draftNumIndicator = vscode.workspace.getConfiguration('myExtension').get('frontmatter.draftNumIndicator', "draftNum");
    const completeSectionIndicator = vscode.workspace.getConfiguration('myExtension').get('frontmatter.completeSectionIndicator', "completeSection");
    const ydoc = yaml_1.default.parseDocument(m[1]);
    const draftNum = ydoc.get(draftNumIndicator);
    if (typeof draftNum !== "number") {
        return ["", 0];
    }
    ydoc.set(draftNumIndicator, draftNum + 1);
    ydoc.set(completeSectionIndicator, (0, createCompleteDraftTitle_1.createCompleteDraftTitle)(draftNum));
    const fm = ydoc.toString().trimEnd();
    const eol = doc.eol === vscode.EndOfLine.CRLF ? "\r\n" : "\n";
    const replacement = fm ? `---${eol}${fm}${eol}---` : "";
    return [replacement, draftNum];
}
//# sourceMappingURL=updateFrontmatter.js.map