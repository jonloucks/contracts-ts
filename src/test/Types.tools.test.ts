import assert from 'node:assert';

import { OptionalType, RequiredType, isNumber } from "../api/Types";

export const OPTIONAL_CASES: PredicateCase[] = [
    { value: null, help: "a null value" },
    { value: undefined, help: "an undefined value" }
];

function isUltimateAnswer(value: OptionalType<any>): value is OptionalType<number> {
    if (value === null || value === undefined) {
        return true;
    }
    return typeof value === "number" ? value === 42 : false
};

function isRequiredUltimateAnswer(value: OptionalType<any>): value is RequiredType<number> {
    if (value === null || value === undefined) {
        return false;
    }
    return isUltimateAnswer(value);
};

const VALID_CASES: PredicateCase[] = [
    { value: 42, help: "the ultimate answer" },
];

const INVALID_CASES: PredicateCase[] = [
    { value: 0 },
    { value: 43 },
    { value: () => { }, help: "a simple function" },
    { value: Symbol("test"), help: "a symbol value" },
    { value: function () { }, help: "a traditional function" },
    { value: async () => { }, help: "an async function" },
    { value: {}, help: "an object value" }
]

generatePredicateSuite({
    name: 'isUltimateAnswer',
    function: isUltimateAnswer,
    validCases: [...VALID_CASES, ...OPTIONAL_CASES],
    invalidCases: INVALID_CASES
});

generatePredicateSuite({
    name: 'isRequiredUltimateAnswer',
    function: isRequiredUltimateAnswer,
    validCases: VALID_CASES,
    invalidCases: [...INVALID_CASES, ...OPTIONAL_CASES]
});

export interface PredicateCase {
    value: OptionalType<any>
    help?: string;
}

export interface PredicateSuiteOptions {
    name: string;
    function: (value: OptionalType<any>) => boolean;
    validCases?: PredicateCase[];
    invalidCases?: PredicateCase[];
}

export function generatePredicateSuite<T>(options: PredicateSuiteOptions) {
    const { validCases, invalidCases } = options;
    describe(`Predicate Suite for ${options.name}`, () => {
        validCases?.forEach((testCase, index) => {
            const help = testCase?.help ?? String(testCase.value);
            const scenario: string = `case ${index} => (${help}) : should pass`;
            it(scenario, () => {
                const actual: boolean = options.function(testCase.value);
                assert.strictEqual(actual, true, options.name + "(" + help + ") returned " + actual);
            });
        });
        invalidCases?.forEach((testCase, index) => {
            const help = testCase?.help ?? String(testCase.value);
            const scenario: string = `case ${index} => (${help}) : should fail`;
            it(scenario, () => {
                const actual: boolean = options.function(testCase.value);
                assert.strictEqual(actual, false, options.name + "(" + help + ") returned " + actual);
            });
        });
    });
}


