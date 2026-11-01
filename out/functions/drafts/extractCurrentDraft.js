"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCurrentDraft = extractCurrentDraft;
const createCompleteDraftTitle_1 = require("./createCompleteDraftTitle");
const removeInlineComments_1 = require("./removeInlineComments");
function extractCurrentDraft(content, draftNum) {
    const oldDraftNum = draftNum > 1 ? draftNum - 1 : draftNum;
    const previousDraftTitle = (0, createCompleteDraftTitle_1.createCompleteDraftTitle)(oldDraftNum);
    const titleInd = content.indexOf(previousDraftTitle);
    if (titleInd === -1) {
        const continueForward = false;
        return [continueForward, ""];
    }
    const continueForward = true;
    const currentDraft = (0, removeInlineComments_1.removeInlineComments)(content.slice(titleInd + previousDraftTitle.length));
    return [continueForward, currentDraft];
}
//# sourceMappingURL=extractCurrentDraft.js.map