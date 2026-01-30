import { mock, MockProxy } from "jest-mock-extended";
import { ok } from "node:assert";

import { AtomicIntegerFactory, guard, CONTRACT } from "@jonloucks/contracts-ts/auxiliary/AtomicIntegerFactory";
import { assertContract, assertGuard, mockGuardFix } from "../helper.test";

describe('guard tests', () => {
  it('guard should return true for AtomicIntegerFactory', () => {
    const instance: MockProxy<AtomicIntegerFactory> = mock<AtomicIntegerFactory>();
    mockGuardFix(instance, "createAtomicInteger");
    ok(guard(instance), 'AtomicIntegerFactory should return true');
  });
});

assertContract(CONTRACT, "AtomicIntegerFactory");
assertGuard(guard, "createAtomicInteger");
