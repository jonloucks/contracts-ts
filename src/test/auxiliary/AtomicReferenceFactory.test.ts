import { ok } from "node:assert";
import { describe, it } from "node:test";

import { OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { AtomicReference } from "@jonloucks/contracts-ts/auxiliary/AtomicReference";
import { AtomicReferenceFactory, CONTRACT, guard } from "@jonloucks/contracts-ts/auxiliary/AtomicReferenceFactory";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { assertContract, assertGuard } from "@jonloucks/contracts-ts/test/helper.test";

describe('guard tests', () => {
  it('guard should return true for AtomicReferenceFactory', () => {
    const instance: AtomicReferenceFactory = {
      createAtomicReference: function <T>(initialValue?: OptionalType<T>): RequiredType<AtomicReference<T>> {
        used(initialValue);
        throw new Error("Function not implemented.");
      }
    };
    ok(guard(instance), 'AtomicReferenceFactory should return true');
  });
});

assertContract(CONTRACT, "AtomicReferenceFactory");
assertGuard(guard, "createAtomicReference");
