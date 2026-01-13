import assert from "node:assert";

import { Contract } from "contracts-ts/api/Contract";
import { Contracts } from "contracts-ts/api/Contracts";
import { Promisor } from "contracts-ts/api/Promisor";
import { CONTRACT as PROMISOR_FACTORY_CONTRACT, PromisorFactory } from "contracts-ts/api/PromisorFactory";
import { OptionalType } from "contracts-ts/api/Types";
import { Tools } from "contracts-ts/test/Test.tools.test";
import { createContract } from "contracts-ts";

generateValueSuite<string>({
    name: 'Value Promisor with primitive string values',
    validCases: [
        { value: undefined, help: "an undefined string" },
        { value: null, help: "a null string" },
        { value: "hello", help: "a simple string" },
        { value: "", help: "an empty string" },
        { value: " ", help: "a space string" },
    ],
});


generateValueSuite<boolean>({
    name: 'Value Promisor with primitive boolean values',
    validCases: [
        { value: undefined, help: "an undefined boolean" },
        { value: null, help: "a null boolean" },
        { value: true, help: "a true boolean" },
        { value: false, help: "a false boolean" },
    ],
});

generateValueSuite<number>({
    name: 'Value Promisor with primitive number values',
    validCases: [
        { value: undefined, help: "an undefined number" },
        { value: null, help: "a null number" },
        { value: 0, help: "a zero number" },
        { value: 42, help: "a positive number" }
    ],
});

generateValueSuite<Date>({
    name: 'Value Promisor with Date values',
    validCases: [
        { value: undefined, help: "an undefined date" },
        { value: null, help: "a null date" },
        { value: new Date(0), help: "a zero date" },
        { value: new Date(), help: "a current date" }
    ],
});

interface Person {
    name: string;
    age: number;
}

generateValueSuite<Person>({
    name: 'Value Promisor with interface instance values',
    validCases: [
        { value: undefined, help: "an undefined Person" },
        { value: null, help: "a null Person" },
        { value: { name: "Alice", age: 30 }, help: "a Person object" }
    ],
});


interface TestCase<T> {
    value: OptionalType<T>;
    help?: string;
}

interface TestSuiteOptions<T> {
    name: string;
    validCases?: TestCase<T>[];
}

function generateValueSuite<T>(options: TestSuiteOptions<T>) {
    const { validCases } = options;

    describe(options.name, () => {
        validCases?.forEach((testCase, index) => {
            it(`case ${index}: when value is ${testCase?.help ?? testCase.value}`, () => {
                Tools.withContracts((contracts: Contracts) => {
                    const promisorFactory: PromisorFactory = contracts.enforce(PROMISOR_FACTORY_CONTRACT);
                    const contract: Contract<T> = createContract<T>();
                    const promisor: Promisor<T> = promisorFactory.createValue<T>(testCase.value)

                    using usingPromisor = contracts.bind(contract, promisor);

                    const delivered: OptionalType<T> = contracts.claim(contract);
                    assert.strictEqual(delivered, testCase.value, "promisor demand should match the value.");
                });
            });
        });
    });
}

