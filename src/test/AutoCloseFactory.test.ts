import { mock, MockProxy } from "jest-mock-extended";
import { ok } from "node:assert";

import { AutoCloseFactory, guard, CONTRACT } 
  from "@jonloucks/contracts-ts/api/AutoCloseFactory";
import { assertContract, assertGuard, mockGuardFix } from "./helper.test";

describe('guard tests', () => {
  it('guard should return true for AutoCloseFactory', () => {
    const instance: MockProxy<AutoCloseFactory> = mock<AutoCloseFactory>();
    mockGuardFix(instance, "createAutoClose", "createAutoCloseMany", "createAutoCloseOne");
    ok(guard(instance), 'AutoCloseFactory should return true');
  });
});

assertContract(CONTRACT, "AutoCloseFactory");
assertGuard(guard, "createAutoClose", "createAutoCloseMany", "createAutoCloseOne");
