import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { AtomicReferenceFactory, guard, CONTRACT, LAWYER } from "@jonloucks/contracts-ts/auxiliary/AtomicReferenceFactory";
import { assertContract, assertGuard } from "./helper.test";
import { generateTestsForLawyer } from "./Lawyer.tools.test";

describe('guard tests', () => {
  it('guard should return true for AtomicReferenceFactory', () => {
    const instance: AtomicReferenceFactory = mock<AtomicReferenceFactory>();
    ok(guard(instance), 'AtomicReferenceFactory should return true');
  });
});

assertContract(CONTRACT, "AtomicReferenceFactory");
assertGuard(guard, "create");
generateTestsForLawyer(LAWYER);