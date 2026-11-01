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
const assert = __importStar(require("assert"));
const splitParagraphsNoFrontMatter_1 = require("../functions/paragraphs/splitParagraphsNoFrontMatter");
suite("splitParagraphsNoFrontMatter", () => {
    test("keeps only lines starting with the signifier, stripped and trimmed", () => {
        const result = (0, splitParagraphsNoFrontMatter_1.splitParagraphsNoFrontMatter)(["# keep me\nignore me\n#   also keep"], "#");
        assert.deepStrictEqual(result, [["", ["keep me", "also keep"]]]);
    });
    test("returns an empty list for paragraphs with no matching lines", () => {
        const result = (0, splitParagraphsNoFrontMatter_1.splitParagraphsNoFrontMatter)(["nothing here"], "#");
        assert.deepStrictEqual(result, [["", []]]);
    });
    test("handles multiple paragraphs independently", () => {
        const result = (0, splitParagraphsNoFrontMatter_1.splitParagraphsNoFrontMatter)(["#a", "#b\n#c"], "#");
        assert.deepStrictEqual(result, [["", ["a"]], ["", ["b", "c"]]]);
    });
    test("handles an empty input array", () => {
        assert.deepStrictEqual((0, splitParagraphsNoFrontMatter_1.splitParagraphsNoFrontMatter)([], "#"), []);
    });
});
//# sourceMappingURL=splitFrontmatter.test.js.map