"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFrontMatter = removeFrontMatter;
const frontMatterConstants_1 = require("../../constants/frontMatterConstants");
function removeFrontMatter(fileContent) {
    const endIndex = fileContent.indexOf(frontMatterConstants_1.frontMatterEndIndicator);
    if (endIndex === -1) {
        return fileContent;
    }
    const content = fileContent.slice(endIndex + frontMatterConstants_1.frontMatterEndIndicator.length);
    return content;
}
//# sourceMappingURL=removeFrontMatter.js.map