import { isSymbol, isSymbolPresent } from "../api/Types";
import { generatePredicateSuite, OPTIONAL_CASES, PredicateCase } from "./Types.tools.test";

const VALID_CASES: PredicateCase[] = [
    { value: Symbol("test"), help: "a symbol value" },
];

const INVALID_CASES: PredicateCase[] = [
    { value: () => { }, help: "a simple function" },
    { value: function () { }, help: "a traditional function" },
    { value: async () => { }, help: "an async function" },
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
    name: 'isRequiredSymbol',
    function: isSymbolPresent,
    validCases: VALID_CASES,
    invalidCases: [...INVALID_CASES, ...OPTIONAL_CASES]
});




