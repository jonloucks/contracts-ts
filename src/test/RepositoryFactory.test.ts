import { describe, it } from "node:test";
import { ok } from "node:assert";

import { RepositoryFactory, guard, CONTRACT } from "@jonloucks/contracts-ts/api/RepositoryFactory";
import { assertContract, assertGuard } from "./helper.test.js";
import { RepositoryConfig } from "@jonloucks/contracts-ts/api/Convenience";
import { Repository } from "@jonloucks/contracts-ts/api/Repository";
import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";

describe('guard tests', () => {
  it('guard should return true for RepositoryFactory', () => {
    const instance: RepositoryFactory = {
      createRepository: function (config?: RepositoryConfig): RequiredType<Repository> {
        used(config);
        throw new Error("Function not implemented.");
      }
    };
    ok(guard(instance), 'RepositoryFactory should return true');
  });
});

assertContract(CONTRACT, "RepositoryFactory");
assertGuard(guard, "createRepository");
