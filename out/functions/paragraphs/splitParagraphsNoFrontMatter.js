"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitParagraphsNoFrontMatter = splitParagraphsNoFrontMatter;
function splitParagraphsNoFrontMatter(paragraphs, rewriteLineSignifier) {
    let splitParagraph = [];
    paragraphs.forEach((paragraph) => {
        const paraContent = paragraph.split("\n").filter((t) => {
            return t[0] === rewriteLineSignifier;
        }).map(t => {
            return t.slice(1).trim();
        });
        splitParagraph.push(["", paraContent]);
    });
    return splitParagraph;
}
//# sourceMappingURL=splitParagraphsNoFrontMatter.js.map