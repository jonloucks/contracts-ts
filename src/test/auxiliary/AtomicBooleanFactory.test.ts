import { mock, MockProxy } from "jest-mock-extended";
import { ok } from "node:assert";

import { AtomicBooleanFactory, guard, CONTRACT } from "@jonloucks/contracts-ts/auxiliary/AtomicBooleanFactory";
import { assertContract, assertGuard, mockGuardFix } from "../helper.test";

describe('guard tests', () => {
  it('guard should return true for AtomicBooleanFactory', () => {
    const instance: MockProxy<AtomicBooleanFactory> = mock<AtomicBooleanFactory>();
    mockGuardFix(instance, "createAtomicBoolean");
    ok(guard(instance), 'AtomicBooleanFactory should return true');
  });
});

assertContract(CONTRACT, "AtomicBooleanFactory");
assertGuard(guard, "createAtomicBoolean");
