import assert from 'node:assert';

import { OptionalType, RequiredType, isNotPresent } from "../api/Types";
import { Config as ContractConfig, Contract } from "../api/Contract";
import { Lawyer } from "../api/Lawyer";
import { createContract } from "../index";

const LAWYER : Lawyer<Date> = new class implements Lawyer<Date> {
    createContract<X extends Date>(config?: ContractConfig<X> | undefined): RequiredType<Contract<X>>{
        const copy: ContractConfig<X> = { ...config ?? {} };

        copy.test ??= (instance: unknown): instance is X => isNotPresent(instance) || instance instanceof Date;

        return createContract<X>(copy);
    }

    isDeliverable<X extends Date>(instance: unknown): instance is OptionalType<X> {
        return isNotPresent(instance) || instance instanceof Date;
    }
}();

generateTestsForLawyer(LAWYER);

export function generateTestsForLawyer<T>(lawyer: Lawyer<T>) {
    describe(`Testing Lawyer: ${lawyer}`, () => {

        it('Lawyer created contract name', () => {
            assert.notStrictEqual(lawyer.createContract().name, null);
            assert.strictEqual(lawyer.createContract({ name: "abc" }).name, "abc");
            assert.notStrictEqual(lawyer.createContract({ typeName: "xyz" }).name, "xyz");
            assert.strictEqual(lawyer.createContract({ name: "abc", typeName: "xyz" }).name, "abc");
        });

        it('Lawyer created contract type name', () => {
            assert.notStrictEqual(lawyer.createContract().typeName, null);
            assert.notStrictEqual(lawyer.createContract({ name: "abc" }).typeName, "abc");
            assert.strictEqual(lawyer.createContract({ typeName: "xyz" }).typeName, "xyz");
        });

        it('Lawyer created contract is replaceable', () => {
            assert.strictEqual(lawyer.createContract({ replaceable: false }).replaceable, false);
            assert.strictEqual(lawyer.createContract({ replaceable: true }).replaceable, true);
        });
    });
}


