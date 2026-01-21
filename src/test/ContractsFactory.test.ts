import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { ContractsFactory, guard } from "@jonloucks/contracts-ts/api/ContractsFactory";
import { assertGuard } from "./helper.test";

describe('guard tests', () => {
  it('guard should return true for ContractsFactory', () => {
    const instance: ContractsFactory = mock<ContractsFactory>();
    ok(guard(instance), 'ContractsFactory should return true');
  });
});

assertGuard(guard, "create");
