import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { AtomicIntegerFactory, guard, CONTRACT } from "@jonloucks/contracts-ts/auxiliary/AtomicIntegerFactory";
import { assertContract, assertGuard } from "../helper.test";

describe('guard tests', () => {
  it('guard should return true for AtomicIntegerFactory', () => {
    const instance: AtomicIntegerFactory = mock<AtomicIntegerFactory>();
    ok(guard(instance), 'AtomicIntegerFactory should return true');
  });
});

assertContract(CONTRACT, "AtomicIntegerFactory");
assertGuard(guard, "createAtomicInteger");
