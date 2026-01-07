import assert from 'node:assert';

import { Contract } from "../api/Contract";

export interface CastCase<T> {
    instance: any;
    expected?: T;
    help?: string;
}

export interface ContractSuiteOptions<T> {
    name: string;
    contract: Contract<T>;
    validCases?: CastCase<T>[];
    invalidCases?: CastCase<T>[];
}

const someContract: Contract<string> = Contract.create<string>();

generateContractSuite({
    name: 'SomeContract',
    contract: someContract,
    validCases: [
        { instance: "hello", expected: "hello", help: "a string value" }
    ]
});

export function generateContractSuite<T>(options: ContractSuiteOptions<T>) {
    const { contract, validCases, invalidCases } = options;

    describe(`Contract Suite for ${options.name}`, () => {
        validCases?.forEach((testCase, index) => {
            const help = testCase?.help ?? String(testCase.instance);
            const expected: T = testCase.expected ?? testCase.instance;
            const scenario: string = `case ${index} => (${help}) : return ${expected}`;

            it(scenario, () => {
                const actual = contract.cast(testCase.instance);
                assert.strictEqual(actual, expected);
            });
        });

        invalidCases?.forEach((testCase, index) => {
            const help = testCase?.help ?? String(testCase.instance);
            const scenario: string = `case ${index} => (${help}) : should throw ClassCastException`;

            it(scenario, () => {
                assert.throws(() => {
                    contract.cast(testCase.instance);
                }, {
                    name: 'ClassCastException'
                });
            });
        });
    })
}

