import { isBigInt, isRequiredBigInt } from "../api/Types";
import { generatePredicateSuite, PredicateCase, OPTIONAL_CASES } from "./Types.tools.test";

const VALID_CASES: PredicateCase[] = [
    { value: BigInt(42), help: "a bigint value" }
];

const INVALID_CASES: PredicateCase[] = [
    { value: () => { }, help: "a simple function" },
    { value: Symbol("test"), help: "a symbol value" },
    // { value: function () { }, help: "a traditional function" }, 
    { value: async () => { }, help: "an async function" },
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
    name: 'isRequiredBigInt',
    function: isRequiredBigInt,
    validCases: VALID_CASES,
    invalidCases: [...INVALID_CASES, ...OPTIONAL_CASES]
});
