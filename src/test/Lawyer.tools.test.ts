import assert from 'node:assert';

import { OptionalType, RequiredType } from "../api/Types";
import { Config as ContractConfig, Contract } from "../api/Contract";
import { Lawyer } from "../api/Lawyer";

const LAWYER : Lawyer<Date> = new class implements Lawyer<Date> {
    createContract<X extends Date>(config?: ContractConfig<X> | undefined): RequiredType<Contract<X>>{
        const copy: ContractConfig<X> = { ...config ?? {} };

        copy.test ??= (instance: any): instance is X => instance === null || instance === undefined || instance instanceof Date;

        return Contract.create<X>(copy);
    }

    isDeliverable<X extends Date>(instance: any): instance is OptionalType<X> {
        return instance === null || instance === undefined || instance instanceof Date;
    }
}();

generateTestsForLawyer(LAWYER);

export function generateTestsForLawyer<T>(lawyer: Lawyer<T>) {
    describe(`Testing Lawyer: ${lawyer}`, () => {

        it('Lawyer created contract name', () => {
            assert.notStrictEqual(lawyer.createContract().getName(), null);
            assert.strictEqual(lawyer.createContract({ name: "abc" }).getName(), "abc");
            assert.notStrictEqual(lawyer.createContract({ typeName: "xyz" }).getName(), "xyz");
            assert.strictEqual(lawyer.createContract({ name: "abc", typeName: "xyz" }).getName(), "abc");
        });

        it('Lawyer created contract type name', () => {
            assert.notStrictEqual(lawyer.createContract().getTypeName(), null);
            assert.notStrictEqual(lawyer.createContract({ name: "abc" }).getTypeName(), "abc");
            assert.strictEqual(lawyer.createContract({ typeName: "xyz" }).getTypeName(), "xyz");
        });

        it('Lawyer created contract is replaceable', () => {
            assert.strictEqual(lawyer.createContract({ isReplaceable: false }).isReplaceable(), false);
            assert.strictEqual(lawyer.createContract({ isReplaceable: true }).isReplaceable(), true);
        });
    });
}


