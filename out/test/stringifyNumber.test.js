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
// src/test/stringifyNumber.test.ts
const assert = __importStar(require("assert"));
const stringifyNumber_1 = require("../functions/drafts/stringifyNumber");
suite("stringifyNumber", () => {
    test("numbers below 20 use the special table", () => {
        assert.strictEqual((0, stringifyNumber_1.stringifyNumber)(1), "First");
        assert.strictEqual((0, stringifyNumber_1.stringifyNumber)(19), "Nineteenth");
    });
    test("round tens", () => {
        assert.strictEqual((0, stringifyNumber_1.stringifyNumber)(20), "twentieth");
        assert.strictEqual((0, stringifyNumber_1.stringifyNumber)(90), "ninetieth");
    });
    test("compound numbers", () => {
        assert.strictEqual((0, stringifyNumber_1.stringifyNumber)(21), "twenty-First");
        assert.strictEqual((0, stringifyNumber_1.stringifyNumber)(99), "ninety-Ninth");
    });
});
//# sourceMappingURL=stringifyNumber.test.js.map