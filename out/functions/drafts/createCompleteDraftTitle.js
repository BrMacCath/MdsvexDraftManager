"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompleteDraftTitle = createCompleteDraftTitle;
const stringifyNumber_1 = require("./stringifyNumber");
function createCompleteDraftTitle(draftNum) {
    return "## Complete " + (0, stringifyNumber_1.stringifyNumber)(draftNum) + " Draft";
}
//# sourceMappingURL=createCompleteDraftTitle.js.map