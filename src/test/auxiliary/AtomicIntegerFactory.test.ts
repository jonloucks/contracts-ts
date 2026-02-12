import { describe, it } from "node:test";
import { ok } from "node:assert";

import { AtomicIntegerFactory, guard, CONTRACT } from "@jonloucks/contracts-ts/auxiliary/AtomicIntegerFactory";
import { assertContract, assertGuard } from "@jonloucks/contracts-ts/test/helper.test.js";
import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { AtomicInteger } from "@jonloucks/contracts-ts/auxiliary/AtomicInteger";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";

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
