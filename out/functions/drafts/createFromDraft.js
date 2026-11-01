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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFromDraft = createFromDraft;
const splitParagraphsFrontMatter_1 = require("../paragraphs/splitParagraphsFrontMatter");
const splitParagraphsNoFrontMatter_1 = require("../paragraphs/splitParagraphsNoFrontMatter");
const stringifyNumber_1 = require("./stringifyNumber");
const vscode = __importStar(require("vscode"));
function createFromDraft(draft, draftNum) {
    const config = vscode.workspace.getConfiguration('myExtension');
    const paragraphSeparator = config.get("draftStyle.paragraphSeparator", '+---+');
    const topicFrontMatterSeparator = config.get("draftStyle.topicFrontmatterSeparator", "*---*");
    const haveTopicFrontMatter = config.get("draftStyle.haveTopicFrontmatterSeparator", true);
    const rewriteLineSignifier = config.get("draftStyle.rewriteLineSignifier", ">");
    const commentLineSignifier = config.get("draftStyle.commentSignifier");
    const haveCommentLine = config.get("draftStyle.haveLineComments", true);
    const newLineSeperator = haveCommentLine ?
        "\n" + commentLineSignifier + " \n" + rewriteLineSignifier + " \n\n"
        : "\n" + rewriteLineSignifier + " \n\n";
    // Select the content from the current draft.
    const currentDraftTitle = "# " + (0, stringifyNumber_1.stringifyNumber)(draftNum) + " Draft";
    const contentIndex = draft.indexOf(currentDraftTitle) + currentDraftTitle.length;
    const contentDraft = draft.slice(contentIndex);
    let paragraphs = contentDraft.split(paragraphSeparator).filter(t => { return t.trim() !== ""; });
    let splitParagraph = [];
    if (!haveTopicFrontMatter) {
        splitParagraph = (0, splitParagraphsNoFrontMatter_1.splitParagraphsNoFrontMatter)(paragraphs, rewriteLineSignifier);
    }
    else {
        splitParagraph = (0, splitParagraphsFrontMatter_1.splitParagraphsFrontMatter)(paragraphs);
    }
    // Complete Draft
    let completeDraft = [];
    let newDraft = [];
    splitParagraph.forEach((content) => {
        const sentences = content[1].map(t => t.replace(".", ""));
        completeDraft.push(sentences.join(". ") + ".");
    });
    // Make new draft based on the topic front matter.
    if (!haveTopicFrontMatter) {
        splitParagraph.forEach((content) => {
            const sentences = content[1].map(t => t.replace(".", ""));
            newDraft.push("\n" + sentences.join(newLineSeperator) + newLineSeperator);
        });
    }
    else {
        splitParagraph.forEach((content) => {
            const topicFrontMatter = content[0].trim();
            const sentences = content[1].map(t => {
                return t.replace(".", "");
            });
            newDraft.push(topicFrontMatter + "\n\n" + topicFrontMatterSeparator + "\n" + sentences.join(newLineSeperator) + newLineSeperator);
        });
    }
    // New Draft
    let newContent = "";
    newContent += `\n\n## Complete ${(0, stringifyNumber_1.stringifyNumber)(draftNum)} Draft\n\n` + completeDraft.join("\n\n") + "\n\n";
    newContent += `# ${(0, stringifyNumber_1.stringifyNumber)(draftNum + 1)} Draft\n\n` + newDraft.join(paragraphSeparator + "\n");
    return draft + newContent;
}
//# sourceMappingURL=createFromDraft.js.map