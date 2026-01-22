import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { RepositoryFactory, guard, CONTRACT } 
  from "@jonloucks/contracts-ts/api/RepositoryFactory";
import { assertContract, assertGuard } from "./helper.test";

describe('guard tests', () => {
  it('guard should return true for RepositoryFactory', () => {
    const instance: RepositoryFactory = mock<RepositoryFactory>();
    ok(guard(instance), 'RepositoryFactory should return true');
  });
});

assertContract(CONTRACT, "RepositoryFactory");
assertGuard(guard, "create");
