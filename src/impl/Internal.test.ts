import { deepStrictEqual, fail, ok, strictEqual, throws } from "node:assert";

import { ContractException } from "@io.github.jonloucks/contracts-ts/api/ContractException";
import { Internal } from "@io.github.jonloucks/contracts-ts/impl/Internal.impl";

/**
 * Internal tests for internal Helpers functionality.
 */
describe("Internal mapForEachReversed", () => {

  it("with null map throws", () => {
    throws(() => {
      Internal.mapForEachReversed(null as unknown as Map<unknown, unknown>, (_, __) => {
      })
    }, {
      name: 'IllegalArgumentException',
      message: 'Map must be present.'
    })
  });

  it("with empty map does not call callback", () => {
    let callCount = 0;
    const testMap = new Map<string, number>();
    Internal.mapForEachReversed(testMap, (_, __) => {
      callCount++;
    });
    strictEqual(callCount, 0);
  });

  it("with multiple entries calls callback in reverse order", () => {
    const testMap = new Map<string, number>();
    testMap.set("one", 1);
    testMap.set("two", 2);
    testMap.set("three", 3);

    const keys: string[] = [];
    const values: number[] = [];

    Internal.mapForEachReversed(testMap, (key, value) => {
      keys.push(key);
      values.push(value);
    });

    deepStrictEqual(keys, ["three", "two", "one"]);
    deepStrictEqual(values, [3, 2, 1]);
  });
});

describe("Internal throwAggregateError", () => {

  it("with single error throws that error", () => {
    const singleError = new Error("Single error occurred.");
    throws(() => {
      Internal.throwAggregateError("Aggregate error:", singleError);
    }, {
      name: 'Error',
      message: "Single error occurred."
    });
  });

  it("with multiple errors throws ContractException with aggregated messages", () => {
    const error1 = new Error("First error.");
    const error2 = new Error("Second error.");
    const error3 = "Third error as string.";

    try {
      Internal.throwAggregateError("Multiple errors occurred:", error1, error2, error3);
      fail("Expected throwAggregateError to throw.");
    } catch (e) {
      ok(e instanceof ContractException);
      const expectedMessage =
        "Multiple errors occurred:\n" +
        "- First error.\n" +
        "- Second error.\n" +
        "- Third error as string.";
      strictEqual(e.message, expectedMessage);
    }
  });
});