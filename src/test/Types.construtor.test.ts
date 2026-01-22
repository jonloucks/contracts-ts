import { isConstructor } from "@jonloucks/contracts-ts/api/Types";
import { generatePredicateSuite, OPTIONAL_CASES, PredicateCase } from "@jonloucks/contracts-ts/test/Types.tools.test";

const VALID_CASES: PredicateCase[] = [
  { value: Date, help: "a class constructor" }
];

const INVALID_CASES: PredicateCase[] = [
  { value: () : void => { }, help: "a simple function" },
  { value: Symbol("test"), help: "a symbol value" },
  { value: async () : Promise<void> => { }, help: "an async function" },
  { value: 42, help: "a number value" },
  { value: "abc", help: "a string value" },
  { value: {}, help: "an object value" }
]

generatePredicateSuite({
  name: 'isConstructor',
  function: isConstructor,
  validCases: VALID_CASES,
  invalidCases: [...INVALID_CASES, ...OPTIONAL_CASES]
});