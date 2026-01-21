import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { ContractFactory, guard } from "@jonloucks/contracts-ts/api/ContractFactory";
import { isAutoCloseFactory } from "@jonloucks/contracts-ts/api/AutoCloseFactory";

import { assertGuard } from "./helper.test";

describe('guard tests', () => {
  it('guard should return true for ContractFactory', () => {
    const instance: ContractFactory = mock<ContractFactory>();
    ok(guard(instance), 'ContractFactory should return true');
  });
});


describe('ContractFactory exports', () => {
  /** @deprecated test*/
  it('isAutoCloseFactory export works', () => {
    const func = isAutoCloseFactory;
    ok(func !== undefined, "isAutoCloseFactory is defined");
  });
});

assertGuard(guard, "create");
