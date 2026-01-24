
import { isString } from "@jonloucks/contracts-ts/api/Types";
import { generatePredicateSuite, OPTIONAL_CASES, PredicateCase } from "@jonloucks/contracts-ts/test/types/Types.tools.test";

const VALID_CASES: PredicateCase[] = [
  { value: "", help: "a empty string value" },
  { value: "abc", help: "a string value" }
];

const INVALID_CASES: PredicateCase[] = [
  { value: () : void => { }, help: "a simple function" },
  { value: Symbol("test"), help: "a symbol value" },
  { value: async () : Promise<void> => { }, help: "an async function" },
  { value: 42, help: "a number value" },
  { value: {}, help: "an object value" }
]

generatePredicateSuite({
  name: 'isString',
  function: isString,
  validCases: VALID_CASES,
  invalidCases: [...INVALID_CASES, ...OPTIONAL_CASES]
});
