// src/test/stringifyNumber.test.ts
import * as assert from "assert";
import { stringifyNumber } from "../functions/drafts/stringifyNumber";

suite("stringifyNumber", () => {
  test("numbers below 20 use the special table", () => {
    assert.strictEqual(stringifyNumber(1), "First");
    assert.strictEqual(stringifyNumber(19), "Nineteenth");
  });

  test("round tens", () => {
    assert.strictEqual(stringifyNumber(20), "twentieth");
    assert.strictEqual(stringifyNumber(90), "ninetieth");
  });

  test("compound numbers", () => {
    assert.strictEqual(stringifyNumber(21), "twenty-First");
    assert.strictEqual(stringifyNumber(99), "ninety-Ninth");
  });
});