import { describe, it } from "node:test";
import { ok } from "node:assert";

import { AutoCloseFactory, guard, CONTRACT, AutoClose, AutoCloseMany, AutoCloseOne, AutoCloseType, RequiredType }
  from "@jonloucks/contracts-ts/api/AutoCloseFactory";
import { assertContract, assertGuard } from "@jonloucks/contracts-ts/test/helper.test.js";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";

describe('guard tests', () => {
  it('guard should return true for AutoCloseFactory', () => {
    const instance: AutoCloseFactory = {
      createAutoClose: function (type: RequiredType<AutoCloseType>): RequiredType<AutoClose> {
        used(type);
        throw new Error("Function not implemented.");
      },
      createAutoCloseMany: function (): RequiredType<AutoCloseMany> {
        throw new Error("Function not implemented.");
      },
      createAutoCloseOne: function (): RequiredType<AutoCloseOne> {
        throw new Error("Function not implemented.");
      }
    };
    ok(guard(instance), 'AutoCloseFactory should return true');
  });
});

assertContract(CONTRACT, "AutoCloseFactory");
assertGuard(guard, "createAutoClose", "createAutoCloseMany", "createAutoCloseOne");
