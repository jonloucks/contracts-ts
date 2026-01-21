import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { AtomicBooleanFactory, guard, CONTRACT, LAWYER, isAtomicBooleanFactory } from "@jonloucks/contracts-ts/auxiliary/AtomicBooleanFactory";
import { assertContract, assertGuard } from "./helper.test";
import { generateTestsForLawyer } from "./Lawyer.tools.test";

describe('guard tests', () => {
  it('guard should return true for AtomicBooleanFactory', () => {
    const instance: AtomicBooleanFactory = mock<AtomicBooleanFactory>();
    ok(guard(instance), 'AtomicBooleanFactory should return true');
  });
});


describe('AtomicBooleanFactory exports', () => {
  /** @deprecated test*/
  it('isAtomicBooleanFactory export works', () => {
    const func = isAtomicBooleanFactory;
    ok(func !== undefined, "isAtomicBooleanFactory is defined");
  });
});

assertContract(CONTRACT, "AtomicBooleanFactory");
assertGuard(guard, "create");
generateTestsForLawyer(LAWYER);
