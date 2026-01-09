import assert from 'node:assert';

import { Contract, Config as ContractConfig } from "../api/Contract";
import { isRatifiedContract } from "../api/RatifiedContract";
import { createContract, OptionalType } from "../index";

describe('api/RatifiedContract.ts tests', () => {

    it('create without a test or cast should throw ContractException', () => {
        const contractConfig: ContractConfig<string> = {
            ratified: true,
        };
        assert.throws(() => {
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
  
        const maker : new (config?: OptionalType<ContractConfig<string>>) => Contract<string>
             = ratifiedContract.constructor as new () => Contract<string>;

        assert.throws(() => {
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
        assert.strictEqual(isRatifiedContract(contract), true, 'created contract is RatifiedContract');
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
        assert.strictEqual(isRatifiedContract(contract), true, 'created contract is RatifiedContract');
    });
});

describe('api/RatifiedContract.ts tests', () => {
    it('isRatifiedContract with null or undefined should return false', () => {
        assert.strictEqual(isRatifiedContract(null), false, 'with null returns false');
        assert.strictEqual(isRatifiedContract(undefined), false, 'with undefined returns false');
    });

    it('isRatifiedContract with random types should return false ', () => {
        assert.strictEqual(isRatifiedContract({}), false, 'with null empty object returns false');
        assert.strictEqual(isRatifiedContract(() => { }), false, 'with function returns false');
    });

    it('isRatifiedContract with implementation of Contract should return false', () => {
        const contractImpl : Contract<string>= {
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
        assert.strictEqual(isRatifiedContract(contractImpl), false, 'with contract implementation returns false');
    });

    it('Attempt to impersonate RatifiedContract fails', () => {
        const ratifiedContract: Contract<string> = createContract<string>({
            ratified: true,
            test: (value: OptionalType<unknown>): value is string => {
                return typeof value === 'string';
            }
        });
        class FakeRatifiedContract implements Contract<string> {
            cast(value: OptionalType<unknown>): OptionalType<string> {
                return value as OptionalType<string>;
            }
            test(value: OptionalType<unknown>): value is string {
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
            #secret: symbol = Symbol('ratifiedContractMarker');
        };
        const fakeRatified = new FakeRatifiedContract();

        Object.setPrototypeOf(fakeRatified, Object.getPrototypeOf(ratifiedContract));
        fakeRatified.constructor = ratifiedContract.constructor;

        for (const [key, value] of Object.entries(ratifiedContract)) {
            // @ts-expect-error this is a test to impersonate and bypass checks
            fakeRatified[key] = value;
        }

        assert.strictEqual(isRatifiedContract(fakeRatified), false, 'with impersonated RatifiedContract returns false');
    });
});
