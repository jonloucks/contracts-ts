import { mock, MockProxy } from "jest-mock-extended";
import { ok } from "node:assert";

import { ContractsFactory, guard } from "@jonloucks/contracts-ts/api/ContractsFactory";
import { assertGuard, mockGuardFix } from "@jonloucks/contracts-ts/test/helper.test.js";

describe('guard tests', () => {
  it('guard should return true for ContractsFactory', () => {
    const instance: MockProxy<ContractsFactory> = mock<ContractsFactory>();
    mockGuardFix(instance, "createContracts");
    ok(guard(instance), 'ContractsFactory should return true');
  });
});

assertGuard(guard, "createContracts");
