import { isBoolean, isBooleanPresent } from "contracts-ts/api/auxiliary/Types";
import { generatePredicateSuite, OPTIONAL_CASES, PredicateCase } from "contracts-ts/test/Types.tools.test";

// should we consider 0 and 1 as valid boolean values?
// should we consider "true" and "false" as valid boolean values?
// should we consider Boolean objects as valid boolean values?
// also the whole truthy/falsy thing

const VALID_CASES: PredicateCase[] = [
  { value: true, help: "a boolean value" },
  { value: false, help: "a boolean value" }
];

const INVALID_CASES: PredicateCase[] = [
  { value: new Boolean(true), help: "a Boolean true object" },
  { value: new Boolean(false), help: "a Boolean false object" },
  { value: "false", help: "a Boolean true object" },
  { value: "true", help: "a Boolean false object" },
  { value: () => { }, help: "a simple function" },
  { value: Symbol("test"), help: "a symbol value" },
  { value: function () { }, help: "a traditional function" },
  { value: async () => { }, help: "an async function" },
  { value: 42, help: "a number value" },
  { value: 0, help: "a zero number value" },
  { value: 1, help: "a 1 number value" },
  { value: {}, help: "an object value" }
]

generatePredicateSuite({
  name: 'isBoolean',
  function: isBoolean,
  validCases: [...VALID_CASES, ...OPTIONAL_CASES],
  invalidCases: INVALID_CASES
});

generatePredicateSuite({
  name: 'isBooleanPresent',
  function: isBooleanPresent,
  validCases: VALID_CASES,
  invalidCases: [...INVALID_CASES, ...OPTIONAL_CASES]
});

