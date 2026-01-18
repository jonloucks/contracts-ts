import { strictEqual } from "node:assert";

import { OptionalType, RequiredType, isNotPresent } from "@jonloucks/contracts-ts/api/Types";

export const OPTIONAL_CASES: PredicateCase[] = [
  { value: null, help: "a null value" },
  { value: undefined, help: "an undefined value" }
];

function isUltimateAnswer(value: OptionalType<unknown>): value is OptionalType<number> {
  if (isNotPresent(value)) {
    return true;
  }
  return typeof value === "number" ? value === 42 : false
};

function isRequiredUltimateAnswer(value: OptionalType<unknown>): value is RequiredType<number> {
  if (isNotPresent(value)) {
    return false;
  }
  return isUltimateAnswer(value);
};

const VALID_CASES: PredicateCase[] = [
  { value: 42, help: "the ultimate answer" },
];

const INVALID_CASES: PredicateCase[] = [
  { value: 0, help: "a zero number value" },
  { value: 43, help: "a number value" },
  { value: () : void => { }, help: "a simple function" },
  { value: Symbol("test"), help: "a symbol value" },
  { value: function () : void { }, help: "a traditional function" },
  { value: async () : Promise<void> => { }, help: "an async function" },
  { value: {}, help: "an object value" }
]

generatePredicateSuite({
  name: 'isUltimateAnswer',
  function: isUltimateAnswer,
  validCases: [...VALID_CASES, ...OPTIONAL_CASES],
  invalidCases: INVALID_CASES
});

generatePredicateSuite({
  name: 'isRequiredUltimateAnswer',
  function: isRequiredUltimateAnswer,
  validCases: VALID_CASES,
  invalidCases: [...INVALID_CASES, ...OPTIONAL_CASES]
});

export interface PredicateCase {
  value: OptionalType<unknown>
  help?: string;
}

export interface PredicateSuiteOptions {
  name: string;
  function: (value: OptionalType<unknown>) => boolean;
  validCases?: PredicateCase[];
  invalidCases?: PredicateCase[];
}

export function generatePredicateSuite(options: PredicateSuiteOptions) : void {
  const { validCases, invalidCases } = options;
  describe(`Predicate Suite for ${options.name}`, () => {
    validCases?.forEach((testCase, index) => {
      const help = testCase?.help ?? String(testCase.value);
      const scenario: string = `case ${index} => (${help}) : should pass`;
      it(scenario, () => {
        const actual: boolean = options.function(testCase.value);
        strictEqual(actual, true, options.name + "(" + help + ") returned " + actual);
      });
    });
    invalidCases?.forEach((testCase, index) => {
      const help = testCase?.help ?? String(testCase.value);
      const scenario: string = `case ${index} => (${help}) : should fail`;
      it(scenario, () => {
        const actual: boolean = options.function(testCase.value);
        strictEqual(actual, false, options.name + "(" + help + ") returned " + actual);
      });
    });
  });
}


