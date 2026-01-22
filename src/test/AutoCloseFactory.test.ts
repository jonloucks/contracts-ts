import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { AutoCloseFactory, guard, CONTRACT } 
  from "@jonloucks/contracts-ts/api/AutoCloseFactory";
import { assertContract, assertGuard } from "./helper.test";

describe('guard tests', () => {
  it('guard should return true for AutoCloseFactory', () => {
    const instance: AutoCloseFactory = mock<AutoCloseFactory>();
    ok(guard(instance), 'AutoCloseFactory should return true');
  });
});

assertContract(CONTRACT, "AutoCloseFactory");
assertGuard(guard, "createAutoClose", "createAutoCloseMany", "createAutoCloseOne");
