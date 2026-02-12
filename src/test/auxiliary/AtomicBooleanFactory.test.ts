import { describe, it } from "node:test";
import { ok } from "node:assert";

import { AtomicBooleanFactory, guard, CONTRACT } from "@jonloucks/contracts-ts/auxiliary/AtomicBooleanFactory";
import { assertContract, assertGuard } from "@jonloucks/contracts-ts/test/helper.test.js";
import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { AtomicBoolean } from "@jonloucks/contracts-ts/auxiliary/AtomicBoolean";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";

describe('guard tests', () => {
  it('guard should return true for AtomicBooleanFactory', () => {
    const instance: AtomicBooleanFactory = {
      createAtomicBoolean: function (initialValue?: boolean): RequiredType<AtomicBoolean> {
        used(initialValue);
        throw new Error("Function not implemented.");
      }
    };
    ok(guard(instance), 'AtomicBooleanFactory should return true');
  });
});

assertContract(CONTRACT, "AtomicBooleanFactory");
assertGuard(guard, "createAtomicBoolean");
