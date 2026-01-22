import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { AtomicBooleanFactory, guard, CONTRACT } from "@jonloucks/contracts-ts/auxiliary/AtomicBooleanFactory";
import { assertContract, assertGuard } from "./helper.test";

describe('guard tests', () => {
  it('guard should return true for AtomicBooleanFactory', () => {
    const instance: AtomicBooleanFactory = mock<AtomicBooleanFactory>();
    ok(guard(instance), 'AtomicBooleanFactory should return true');
  });
});

assertContract(CONTRACT, "AtomicBooleanFactory");
assertGuard(guard, "createAtomicBoolean");
