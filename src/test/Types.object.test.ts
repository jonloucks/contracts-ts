import { isObject, isObjectPresent } from "@jonloucks/contracts-ts/api/auxiliary/Types";
import { generatePredicateSuite, OPTIONAL_CASES, PredicateCase } from "@jonloucks/contracts-ts/test/Types.tools.test";

const VALID_CASES: PredicateCase[] = [
  { value: {}, help: "an object value" }, 
  { value: new Number(34.5), help: "a number object" }
];

const INVALID_CASES: PredicateCase[] = [
  { value: 42, help: "a number value" },
  { value: -1, help: "a number value" },
  { value: Number.NaN, help: "NaN value" },
  { value: Number.POSITIVE_INFINITY, help: "a positive infinity value" },
  { value: Number.NEGATIVE_INFINITY, help: "a negative infinity value" },
  { value: BigInt(42), help: "a bigint value" },
  { value: () : void => { }, help: "a simple function" },
  { value: async () : Promise<void> => { }, help: "an async function" },
  { value: "abc", help: "a string value" },
  { value: Symbol("test"), help: "a symbol value" },
]

generatePredicateSuite({
  name: 'isObject',
  function: isObject,
  validCases: [...VALID_CASES, ...OPTIONAL_CASES],
  invalidCases: INVALID_CASES
});

generatePredicateSuite({
  name: 'isObjectPresent',
  function: isObjectPresent,
  validCases: VALID_CASES,
  invalidCases: [...INVALID_CASES, ...OPTIONAL_CASES]
});