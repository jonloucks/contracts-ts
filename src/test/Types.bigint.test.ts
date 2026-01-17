import { isBigInt, isBigIntPresent } from "@jonloucks/contracts-ts/api/auxiliary/Types";
import { generatePredicateSuite, OPTIONAL_CASES, PredicateCase } from "@jonloucks/contracts-ts/test/Types.tools.test";

const VALID_CASES: PredicateCase[] = [
  { value: BigInt(42), help: "a bigint value" }
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
  name: 'isBigInt',
  function: isBigInt,
  validCases: [...VALID_CASES, ...OPTIONAL_CASES],
  invalidCases: INVALID_CASES
});

generatePredicateSuite({
  name: 'isBigIntPresent',
  function: isBigIntPresent,
  validCases: VALID_CASES,
  invalidCases: [...INVALID_CASES, ...OPTIONAL_CASES]
});
