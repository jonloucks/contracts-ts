import { strictEqual, throws } from "node:assert";

import { createContract } from "contracts-ts";
import { Contract } from "contracts-ts/api/Contract";

export interface CastCase<T> {
  instance: unknown;
  expected?: T;
  help?: string;
}

export interface ContractSuiteOptions<T> {
  name: string;
  contract: Contract<T>;
  validCases?: CastCase<T>[];
  invalidCases?: CastCase<T>[];
}

const someContract: Contract<string> = createContract<string>();

generateContractSuite({
  name: 'SomeContract',
  contract: someContract,
  validCases: [
    { instance: "hello", expected: "hello", help: "a string value" }
  ]
});

export function generateContractSuite<T>(options: ContractSuiteOptions<T>) : void {
  const { contract, validCases, invalidCases } = options;

  describe(`Contract Suite for ${options.name}`, () => {
    validCases?.forEach((testCase, index) => {
      const help = testCase?.help ?? String(testCase.instance);
      const expected = testCase?.expected ?? testCase.instance;
      const scenario: string = `case ${index} => (${help}) : return ${expected}`;

      it(scenario, () => {
        const actual = contract.cast(testCase.instance);
        strictEqual(actual, expected);
      });
    });

    invalidCases?.forEach((testCase, index) => {
      const help = testCase?.help ?? String(testCase.instance);
      const scenario: string = `case ${index} => (${help}) : should throw ClassCastException`;

      it(scenario, () => {
        throws(() => {
          contract.cast(testCase.instance);
        }, {
          name: 'ClassCastException'
        });
      });
    });
  })
}

