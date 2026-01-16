import { isSymbol, isSymbolPresent } from "@io.github.jonloucks/contracts-ts/api/auxiliary/Types";
import { generatePredicateSuite, OPTIONAL_CASES, PredicateCase } from "@io.github.jonloucks/contracts-ts/test/Types.tools.test";

const VALID_CASES: PredicateCase[] = [
  { value: Symbol("test"), help: "a symbol value" },
];

const INVALID_CASES: PredicateCase[] = [
  { value: () : void => { }, help: "a simple function" },
  { value: function () : void { }, help: "a traditional function" },
  { value: async () : Promise<void> => { }, help: "an async function" },
  { value: 42, help: "a number value" },
  { value: "abc", help: "a string value" },
  { value: {}, help: "an object value" },
]

generatePredicateSuite({
  name: 'isSymbol',
  function: isSymbol,
  validCases: [...VALID_CASES, ...OPTIONAL_CASES],
  invalidCases: INVALID_CASES
});

generatePredicateSuite({
  name: 'isSymbolPresent',
  function: isSymbolPresent,
  validCases: VALID_CASES,
  invalidCases: [...INVALID_CASES, ...OPTIONAL_CASES]
});




