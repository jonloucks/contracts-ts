import { describe, it } from "node:test";
import { ok } from "node:assert";

import { ContractsFactory, guard } from "@jonloucks/contracts-ts/api/ContractsFactory";
import { assertGuard } from "@jonloucks/contracts-ts/test/helper.test.js";
import { Config, Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";

describe('guard tests', () => {
  it('guard should return true for ContractsFactory', () => {
    const instance: ContractsFactory = {
      createContracts: function (config?: Config): RequiredType<Contracts> {
        used(config);
        throw new Error("Function not implemented.");
      }
    };
    ok(guard(instance), 'ContractsFactory should return true');
  });
});

assertGuard(guard, "createContracts");
