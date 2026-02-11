import { mock, MockProxy } from "jest-mock-extended";
import { ok } from "node:assert";

import { AtomicReferenceFactory, guard, CONTRACT } from "@jonloucks/contracts-ts/auxiliary/AtomicReferenceFactory";
import { assertContract, assertGuard, mockGuardFix } from "@jonloucks/contracts-ts/test/helper.test.js";

describe('guard tests', () => {
  it('guard should return true for AtomicReferenceFactory', () => {
    const instance: MockProxy<AtomicReferenceFactory> = mock<AtomicReferenceFactory>();
    mockGuardFix(instance, "createAtomicReference");
    ok(guard(instance), 'AtomicReferenceFactory should return true');
  });
});

assertContract(CONTRACT, "AtomicReferenceFactory");
assertGuard(guard, "createAtomicReference");
