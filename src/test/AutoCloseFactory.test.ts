import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { AutoCloseFactory, guard, CONTRACT, isAutoCloseFactory, LAWYER } 
  from "@jonloucks/contracts-ts/api/AutoCloseFactory";
import { assertContract, assertGuard } from "./helper.test";
import { generateTestsForLawyer } from "./Lawyer.tools.test";

describe('guard tests', () => {
  it('guard should return true for AutoCloseFactory', () => {
    const instance: AutoCloseFactory = mock<AutoCloseFactory>();
    ok(guard(instance), 'AutoCloseFactory should return true');
  });
});

describe('AutoCloseFactory exports', () => {
  /** @deprecated test*/
  it('isAutoCloseFactory export works', () => {
    const func = isAutoCloseFactory;
    ok(func !== undefined, "isAutoCloseFactory is defined");
  });
});

assertContract(CONTRACT, "AutoCloseFactory");
assertGuard(guard, "createAutoClose", "createAutoCloseMany", "createAutoCloseOne");
generateTestsForLawyer(LAWYER);