import { notStrictEqual, strictEqual } from "node:assert";

import { createContract } from "@jonloucks/contracts-ts";
import { Contract, Config as ContractConfig } from "@jonloucks/contracts-ts/api/Contract";
import { Lawyer } from "@jonloucks/contracts-ts/api/Lawyer";
import { OptionalType, RequiredType, isNotPresent } from "@jonloucks/contracts-ts/api/Types";

const LAWYER: Lawyer<Date> = new class implements Lawyer<Date> {
  createContract<X extends Date>(config?: ContractConfig<X> | undefined): RequiredType<Contract<X>> {
    const copy: ContractConfig<X> = { ...config ?? {} };

    copy.test ??= (instance: unknown): instance is X => isNotPresent(instance) || instance instanceof Date;

    return createContract<X>(copy);
  }

  isDeliverable<X extends Date>(instance: unknown): instance is OptionalType<X> {
    return isNotPresent(instance) || instance instanceof Date;
  }
}();

generateTestsForLawyer(LAWYER);

export function generateTestsForLawyer<T>(lawyer: Lawyer<T>) : void {
  describe(`Testing Lawyer: ${lawyer}`, () => {

    it('Lawyer created contract name', () => {
      notStrictEqual(lawyer.createContract().name, null, "with no config, name is not null");
      strictEqual(lawyer.createContract({ name: "abc" }).name, "abc", "with name in config, name is as given");
      notStrictEqual(lawyer.createContract({ typeName: "xyz" }).name, "xyz", "with only typeName in config, name is not typeName");
      strictEqual(lawyer.createContract({ name: "abc", typeName: "xyz" }).name, "abc", "with name and typeName in config, name is as given");
    });

    it('Lawyer created contract type name', () => {
      notStrictEqual(lawyer.createContract().typeName, null, "with no config, typeName is not null");
      notStrictEqual(lawyer.createContract({ name: "abc" }).typeName, "abc", "with name in config, typeName is not name");
      strictEqual(lawyer.createContract({ typeName: "xyz" }).typeName, "xyz", "with typeName in config, typeName is as given");
    });

    it('Lawyer created contract is replaceable', () => {
      strictEqual(lawyer.createContract({ replaceable: false }).replaceable, false, "with replaceable false in config, replaceable is false");
      strictEqual(lawyer.createContract({ replaceable: true }).replaceable, true, "with replaceable true in config, replaceable is true");
    });

    it ('Lawyer isDeliverable works', () => {
      strictEqual(lawyer.isDeliverable(null), true, "null is deliverable");
      strictEqual(lawyer.isDeliverable(undefined), true, "undefined is deliverable");
    }); 
  });
}


