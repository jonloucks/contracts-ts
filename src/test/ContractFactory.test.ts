import { mock, MockProxy } from "jest-mock-extended";
import { ok } from "node:assert";

import { ContractFactory, guard } from "@jonloucks/contracts-ts/api/ContractFactory";

import { assertGuard, mockGuardFix } from "./helper.test";

describe('guard tests', () => {
  it('guard should return true for ContractFactory', () => {
    const instance: MockProxy<ContractFactory> = mock<ContractFactory>();
    mockGuardFix(instance, "createContract");
    ok(guard(instance), 'ContractFactory should return true');
  });
});

assertGuard(guard, "createContract");
