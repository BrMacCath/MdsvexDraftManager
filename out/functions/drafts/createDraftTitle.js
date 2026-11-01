"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDraftTitle = createDraftTitle;
const stringifyNumber_1 = require("./stringifyNumber");
function createDraftTitle(draftNum) {
    return "# " + (0, stringifyNumber_1.stringifyNumber)(draftNum) + " Draft";
}
//# sourceMappingURL=createDraftTitle.js.map