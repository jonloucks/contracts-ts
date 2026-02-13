import { ok } from "node:assert";
import { describe, it } from "node:test";

import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { AtomicInteger } from "@jonloucks/contracts-ts/auxiliary/AtomicInteger";
import { AtomicIntegerFactory, CONTRACT, guard } from "@jonloucks/contracts-ts/auxiliary/AtomicIntegerFactory";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { assertContract, assertGuard } from "@jonloucks/contracts-ts/test/helper.test";

describe('guard tests', () => {
  it('guard should return true for AtomicIntegerFactory', () => {
    const instance: AtomicIntegerFactory = {
      createAtomicInteger: function (initialValue?: number): RequiredType<AtomicInteger> {
        used(initialValue);
        throw new Error("Function not implemented.");
      }
    };
    ok(guard(instance), 'AtomicIntegerFactory should return true');
  });
});

assertContract(CONTRACT, "AtomicIntegerFactory");
assertGuard(guard, "createAtomicInteger");
