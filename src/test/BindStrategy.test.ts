import { strictEqual, notStrictEqual, fail } from "node:assert";

import { BindStrategy, DEFAULT_BIND_STRATEGY, isBindStrategy, resolveBindStrategy } from "contracts-ts/api/BindStrategy";
import { RequiredType, isNotPresent } from "contracts-ts/api/auxiliary/Types";

generateBindStrategySuite({
  validCases: [
    { value: undefined, help: "an undefined string" },
    { value: null, help: "a null string" },
    { value: "IF_ALLOWED", help: "a valid bind strategy string" },
    { value: "IF_NOT_BOUND", help: "a valid bind strategy string" },
    { value: "ALWAYS", help: "a valid bind strategy string" },
  ],
  invalidCases: [
    { value: "", help: "an invalid bind empty string" },
    { value: "junk", help: "an invalid bind junk string" },
    { value: "if_allowed", help: "lower case bind strategy string" },
    { value: 123, help: "a number" },
    { value: {}, help: "an object" },
    { value: [], help: "an array" },
    { value: true, help: "a boolean true" },
    { value: false, help: "a boolean false" }
  ],
});

interface TestCase {
  value: unknown;
  help?: string;
}

interface TestSuiteOptions {
  validCases?: TestCase[];
  invalidCases?: TestCase[];
}

export function generateBindStrategySuite(options: TestSuiteOptions) {
  const { validCases, invalidCases } = options;

  describe("BindStategy valid values", () => {
    validCases?.forEach((testCase, index) => {
      it(`case ${index}: isBindStrategy when value is ${testCase?.help ?? testCase.value}`, () => {
        strictEqual(isBindStrategy(testCase.value), true, "isBindStrategy should be true.");
      });
      it(`case ${index}: resolveBindStrategy when value is ${testCase?.help ?? testCase.value}`, () => {
        if (isBindStrategy(testCase.value)) {
          const resolved: RequiredType<BindStrategy> = resolveBindStrategy(testCase.value);
          notStrictEqual(resolved, null, "resolved BindStrategy should not be null.");
          if (isNotPresent(testCase.value)) {
            strictEqual(resolved, DEFAULT_BIND_STRATEGY, "resolved BindStrategy should be DEFAULT_BIND_STRATEGY.");
          }
        } else {
          fail("value is not a valid BindStrategy");
        }
      });
    });
  });

  describe("BindStategy invalid values", () => {
    invalidCases?.forEach((testCase, index) => {
      it(`case ${index}: isBindStrategy when value is ${testCase?.help ?? testCase.value}`, () => {
        strictEqual(isBindStrategy(testCase.value), false, "isBindStrategy should be false.");
      });
    });
  });
}



