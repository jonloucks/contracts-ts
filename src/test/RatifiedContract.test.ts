import { strictEqual, throws } from "node:assert";

import { createContract, isNotPresent, OptionalType } from "@jonloucks/contracts-ts";
import { Contract, Config as ContractConfig } from "@jonloucks/contracts-ts/api/Contract";
import { isRatifiedContract } from "@jonloucks/contracts-ts/api/RatifiedContract";

describe('api/RatifiedContract.ts tests', () => {

  it('create without a test or cast should throw ContractException', () => {
    const contractConfig: ContractConfig<string> = {
      ratified: true,
    };
    throws(() => {
      createContract<string>(contractConfig);
    }, {
      name: 'ContractException',
      message: "RatifiedContract requires either a test or cast function must be present."
    });
  });

  it('Calling constructor directly does not bypass checks and throws ContractException', () => {
    const ratifiedContract: Contract<string> = createContract<string>({
      ratified: true,
      test: (value: OptionalType<unknown>): value is string => {
        return typeof value === 'string';
      }
    });

    const maker: new (config?: OptionalType<ContractConfig<string>>) => Contract<string>
      = ratifiedContract.constructor as new () => Contract<string>;

    throws(() => {
      new maker(null);
    }, {
      name: 'ContractException',
      message: "RatifiedContract requires either a test or cast function must be present."
    });
  });

  it('create with a Config.test should work', () => {
    const contractConfig: ContractConfig<string> = {
      ratified: true,
      test: (value: OptionalType<unknown>): value is string => {
        return typeof value === 'string';
      }
    };

    const contract: Contract<string> = createContract<string>(contractConfig);
    strictEqual(isRatifiedContract(contract), true, 'created contract is RatifiedContract');
  });

  it('create with a Config.cast should work', () => {
    const contractConfig: ContractConfig<string> = {
      ratified: true,
      cast: (value: OptionalType<unknown>): OptionalType<string> => {
        if (typeof value === 'string') {
          return value;
        }
        return undefined;
      }
    };

    const contract: Contract<string> = createContract<string>(contractConfig);
    strictEqual(isRatifiedContract(contract), true, 'created contract is RatifiedContract');
  });
});

describe('api/RatifiedContract.ts tests', () => {
  it('isRatifiedContract with null or undefined should return false', () => {
    strictEqual(isRatifiedContract(null), false, 'with null returns false');
    strictEqual(isRatifiedContract(undefined), false, 'with undefined returns false');
  });

  it('isRatifiedContract with random types should return false ', () => {
    strictEqual(isRatifiedContract({}), false, 'with null empty object returns false');
    strictEqual(isRatifiedContract(() => { }), false, 'with function returns false');
  });

  it('isRatifiedContract with implementation of Contract should return false', () => {
    const contractImpl: Contract<string> = {
      name: "TestContract",
      typeName: "TestType",
      replaceable: false,
      cast(value: OptionalType<unknown>): OptionalType<string> {
        if (typeof value === 'string') {
          return value;
        }
        return undefined;
      },
    };
    strictEqual(isRatifiedContract(contractImpl), false, 'with contract implementation returns false');
  });

  it('Attempt to impersonate RatifiedContract fails', () => {
    const ratifiedContract: Contract<string> = createContract<string>({
      ratified: true,
      test: (value: OptionalType<unknown>): value is string => {
        return typeof value === 'string';
      }
    });
    class FakeRatifiedContract<T> implements Contract<T> {
      cast(value: OptionalType<unknown>): OptionalType<T> {
        return value as OptionalType<T>;
      }
      test(value: OptionalType<unknown>): value is T {
        return true;
      }
      get name(): string {
        return "FakeRatifiedContract";
      }
      get typeName(): string {
        return "string";
      }
      get replaceable(): boolean {
        return false;
      }
        static isRatifiedContract(instance: unknown): instance is FakeRatifiedContract<unknown> {
          if (isNotPresent(instance)) {
            return false;
          }
          try {
            const candidate = instance as FakeRatifiedContract<unknown>;
            return candidate.#secret === FakeRatifiedContract.#SECRET;
          } catch {
            return false;
          }
        }
          static readonly #SECRET: symbol = Symbol("Contract");

      #secret: symbol = FakeRatifiedContract.#SECRET;
    };
    const fakeRatified = new FakeRatifiedContract();

    Object.setPrototypeOf(fakeRatified, Object.getPrototypeOf(ratifiedContract));
    fakeRatified.constructor = ratifiedContract.constructor;

    for (const [key, value] of Object.entries(ratifiedContract)) {
      // @ts-expect-error this is a test to impersonate and bypass checks
      fakeRatified[key] = value;
    }

    strictEqual(isRatifiedContract(fakeRatified), false, 'with impersonated RatifiedContract returns false');
  });
});
