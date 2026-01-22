import { isFunction } from "@jonloucks/contracts-ts/api/Types";
import { generatePredicateSuite, OPTIONAL_CASES, PredicateCase } from "@jonloucks/contracts-ts/test/Types.tools.test";

const VALID_CASES: PredicateCase[] = [
  { value: () : void => { }, help: "a simple function" },
  { value: function () : void { }, help: "a traditional function" },
  { value: async () : Promise<void> => { }, help: "an async function" },
];

const INVALID_CASES: PredicateCase[] = [
  { value: 42, help: "a number value" },
  { value: "abc", help: "a string value" },
  { value: {}, help: "an object value" },
]

generatePredicateSuite({
  name: 'isFunction',
  function: isFunction,
  validCases: VALID_CASES,
  invalidCases: [...INVALID_CASES, ...OPTIONAL_CASES]
});
