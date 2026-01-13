import { isBigInt, isBigIntPresent } from "contracts-ts/api/Types";
import { generatePredicateSuite, OPTIONAL_CASES, PredicateCase } from "contracts-ts/test/Types.tools.test";

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
    name: 'isBigIntPresent',
    function: isBigIntPresent,
    validCases: VALID_CASES,
    invalidCases: [...INVALID_CASES, ...OPTIONAL_CASES]
});
