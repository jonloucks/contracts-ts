import { isNumber, isRequiredNumber } from "../api/Types";
import { generatePredicateSuite, PredicateCase, OPTIONAL_CASES } from "./Types.tools.test";

const VALID_CASES: PredicateCase[] = [
    { value: 42, help: "a number value" },
    { value: -1, help: "a number value" },
    { value: Number.NaN, help: "NaN value" },
    { value: Number.POSITIVE_INFINITY, help: "a positive infinity value" },
    { value: Number.NEGATIVE_INFINITY, help: "a negative infinity value" }
];

const INVALID_CASES: PredicateCase[] = [
    { value: BigInt(42), help: "a bigint value" },
    { value: new Number(34.5), help: "a number object" },
    { value: () => { }, help: "a simple function" },
    { value: Symbol("test"), help: "a symbol value" },
    // { value: function () { }, help: "a traditional function" }, 
    { value: async () => { }, help: "an async function" },
    { value: "abc", help: "a string value" },
    { value: {}, help: "an object value" }
]

generatePredicateSuite({
    name: 'isNumber',
    function: isNumber,
    validCases: [...VALID_CASES, ...OPTIONAL_CASES],
    invalidCases: INVALID_CASES
});

generatePredicateSuite({
    name: 'isRequiredNumber',
    function: isRequiredNumber,
    validCases: VALID_CASES,
    invalidCases: [...INVALID_CASES, ...OPTIONAL_CASES]
});