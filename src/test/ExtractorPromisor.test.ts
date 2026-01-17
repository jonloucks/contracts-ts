import { notStrictEqual, ok, strictEqual } from "node:assert";

import { createContract } from "@jonloucks/contracts-ts";
import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { Promisor, typeToPromisor } from "@jonloucks/contracts-ts/api/Promisor";
import { PromisorFactory, CONTRACT as PROMISORS_CONTRACT } from "@jonloucks/contracts-ts/api/PromisorFactory";
import { OptionalType, RequiredType, Transform } from "@jonloucks/contracts-ts/api/auxiliary/Types";
import { Tools } from "@jonloucks/contracts-ts/test/Test.tools.test";

describe('Extract Promisor tests', () => {

  it("", () => {
    const referent: CurrentDatePromisor = new CurrentDatePromisor();
    const converted: RequiredType<Promisor<Date>> = typeToPromisor<Date>(referent);
    strictEqual(converted, referent, "Converted promisor should be the same as the original referent.");

    const transform: Transform<Date, string> = {
      transform: (date: RequiredType<Date>): string => {
        return date?.toString();
      }
    };

    notStrictEqual(transform.transform(new Date()), null, "Transform should not be null.");
    notStrictEqual(transform.transform(new Date()), undefined, "Transform should not be undefined.");

    Tools.withContracts((contracts: Contracts) => {
      const promisorFactory: PromisorFactory = contracts.enforce(PROMISORS_CONTRACT);
      const contract: Contract<string> = createContract<string>();
      const promisor: Promisor<string> = promisorFactory.createExtractor<Date, string>(referent, transform);

      using _usingPromisor = contracts.bind(contract, promisor);

      const firstClaim: OptionalType<string> = contracts.claim(contract);
      const secondClaim: OptionalType<string> = contracts.claim(contract);

      notStrictEqual(firstClaim, null, "First claim should not be null.");
      notStrictEqual(firstClaim, undefined, "First claim should not be undefined.");
      ok(typeof firstClaim === 'string', "First claimed value should be a string.");
      notStrictEqual(secondClaim, null, "Second claim should not be null.");
      notStrictEqual(secondClaim, undefined, "Second claim should not be undefined.");
      ok(typeof secondClaim === 'string', "Second claimed value should be a string.");
    });
    strictEqual(referent.usageCount, 0, "Referent usage count should be zero after use.");
    strictEqual(referent.demandCount, 2, "Referent demand count should be two after use.");
  });
});

class CurrentDatePromisor implements Promisor<Date> {
  demand(): OptionalType<Date> {
    ++this.demandCount
    if (this.usageCount <= 0) {
      throw new Error("Usage count should be greater than zero.");
    }
    return new Date();
  }
  incrementUsage(): number {
    return ++this.usageCount;
  }
  decrementUsage(): number {
    const save = --this.usageCount;
    if (this.usageCount < 0) {
      throw new Error("Decemented too many times.");
    }
    return save;
  }
  usageCount: number = 0;
  demandCount: number = 0;
};