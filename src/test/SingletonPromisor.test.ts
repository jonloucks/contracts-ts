import assert from 'node:assert';

import { Tools } from "./Test.tools.test";
import { OptionalType } from "../api/Types";
import { Contracts } from "../api/Contracts";
import { Contract } from "../api/Contract";
import { inlinePromisor, Promisor } from "../api/Promisor";
import { PromisorFactory as PromisorFactory, CONTRACT as PROMISORS_CONTRACT } from "../api/PromisorFactory";


generateSingletonSuite<Date>({
    name: 'Singleton Promisor with current Date',
    validCases: [
        { value: () => { return undefined; }, help: "an undefined Date" },
        { value: () => { return null; }, help: "a null Date" },
        { value: () => { return new Date(); }, help: "a current date" }
    ],
});

let counter = 0;

generateSingletonSuite<number>({
    name: 'Singleton Promisor with number counter',
    validCases: [
        { value: () => { return undefined; }, help: "an undefined number" },
        { value: () => { return null; }, help: "a null number" },
        { value: () => { return ++counter; }, help: "a current number" }
    ],
});

interface Person {
    name: string;
    age: number;
}

generateSingletonSuite<Person>({
    name: 'Singleton Promisor with interface instance values',
    validCases: [
        { value: () => { return undefined; }, help: "an undefined Person" },
        { value: () => { return null; }, help: "a null Person" },
        { value: () => { return { name: "Alice", age: 30 } }, help: "a Person object" }
    ],
});

interface TestCase<T> {
    value: () => OptionalType<T>;
    help?: string;
}

interface TestSuiteOptions<T> {
    name: string;
    validCases?: TestCase<T>[];
    invalidCases?: TestCase<T>[];
}

export function generateSingletonSuite<T>(options: TestSuiteOptions<T>) {
    const { validCases, invalidCases } = options;

    describe(options.name, () => {
        validCases?.forEach((testCase, index) => {
            it(`case ${index}: when value is ${testCase?.help ?? testCase.value}`, () => {
                Tools.withContracts((contracts: Contracts) => {
                    const promisorFactory: PromisorFactory = contracts.enforce(PROMISORS_CONTRACT);
                    const contract: Contract<T> = Contract.create<T>();
                    const valuePromisor: Promisor<T> = inlinePromisor<T>(testCase.value);
                    const promisor: Promisor<T> = promisorFactory.createSingleton<T>(valuePromisor)

                    using usingPromisor = contracts.bind(contract, promisor);

                    const firstClaim: OptionalType<T> = contracts.claim(contract);
                    const secondClaim: OptionalType<T> = contracts.claim(contract);
                    assert.strictEqual(firstClaim, secondClaim, "both claims should be the same instance.");
                });
            });
        });
    });

    // invalidCases?.forEach((testCase, index) => {
    //     it(`cast with ${testCase?.help ?? testCase.instance} throws ClassCastException`, () => {
    //         assert.throws(() => {
    //             contract.cast(testCase.instance);
    //         }, {
    //             name: 'ClassCastException'
    //         });
    //     });
    // });
}

