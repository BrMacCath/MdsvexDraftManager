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
exports.createFromFirstDraft = createFromFirstDraft;
const vscode = __importStar(require("vscode"));
const frontMatterConstants_1 = require("../../constants/frontMatterConstants");
//What should this do?
// Add onto the draft in two ways.
// First it should have a completed draft added onto the end of the draft.
// Second it should add onto the 
// Return [frontmatter,content]
function createFromFirstDraft(draft) {
    // config settings
    const config = vscode.workspace.getConfiguration('myExtension');
    const paragraphSeparator = config.get("draftStyle.paragraphSeparator", '+---+');
    const topicFrontMatterSeparator = config.get("draftStyle.topicFrontmatterSeparator", "*---*");
    const haveTopicFrontMatter = config.get("draftStyle.haveTopicFrontmatterSeparator", true);
    const rewriteLineSignifier = config.get("draftStyle.rewriteLineSignifier", ">");
    const haveCommentLine = config.get("draftStyle.haveLineComments", true);
    const commentLineSignifier = config.get("draftStyle.commentSignifier");
    const firstParagraphSeparator = "\n";
    const newLineSeperator = haveCommentLine ?
        "\n" + commentLineSignifier + " \n" + rewriteLineSignifier + " \n\n"
        : "\n" + rewriteLineSignifier + " \n\n";
    // Remove frontmatter
    if (draft.slice(0, 3) === frontMatterConstants_1.frontMatterIndicator) {
        draft = draft.slice(3);
        const frontmatterIndex = draft.indexOf(frontMatterConstants_1.frontMatterIndicator);
        draft = draft.slice(frontmatterIndex + frontMatterConstants_1.frontMatterIndicator.length);
    }
    // Remove the first Heading.
    const firstTitle = "# First Draft";
    const firstTitleIndex = draft.indexOf(firstTitle) + firstTitle.length;
    const tempDraft = draft.slice(firstTitleIndex);
    let paragraphs = tempDraft
        .split(firstParagraphSeparator).filter((t) => { return t.trim() !== ""; });
    let splitParagraph = [];
    paragraphs.forEach((paragraph) => {
        const paraContent = paragraph.split(".");
        splitParagraph.push(["", paraContent]);
    });
    // Complete Draft
    let completeDraft = [];
    let newDraft = [];
    splitParagraph.forEach((content) => {
        const sentences = content[1].filter((t) => {
            return t.trim() !== "";
        });
        completeDraft.push(sentences.join(".") + ".");
    });
    // Make new draft based on the topic front matter.
    if (!haveTopicFrontMatter) {
        splitParagraph.forEach((content) => {
            const sentences = content[1].filter((t) => { return t.trim() !== ""; });
            newDraft.push("\n" + sentences.join(newLineSeperator) + newLineSeperator);
        });
    }
    else {
        splitParagraph.forEach((content) => {
            const topicFrontMatter = content[0];
            const sentences = content[1].filter((t) => {
                return t.trim() !== "";
            });
            newDraft.push("\n" + topicFrontMatter + "\n" + topicFrontMatterSeparator + "\n" + sentences.join(newLineSeperator) + newLineSeperator);
        });
    }
    // New Draft
    let newContent = "";
    newContent += "\n\n## Complete First Draft\n\n" + completeDraft.join("\n\n") + "\n\n";
    newContent += "# Second Draft\n\n" + paragraphSeparator + newDraft.join(paragraphSeparator);
    draft += newContent;
    return draft;
}
//# sourceMappingURL=createFromFirstDraft.js.map