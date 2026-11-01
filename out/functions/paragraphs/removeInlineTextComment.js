"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeInlineTextComment = removeInlineTextComment;
function removeInlineTextComment(str) {
    const frontBrace = String.raw `\{\[`;
    const backBrace = String.raw `\]\}`;
    let testString = String.raw `${frontBrace}(.*?)${backBrace}`;
    let re = new RegExp(testString, "g");
    return str.replace(re, "");
}
//# sourceMappingURL=removeInlineTextComment.js.map