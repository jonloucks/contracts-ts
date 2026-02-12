import { describe, it } from "node:test";
import { ok } from "node:assert";

import { ContractFactory, guard } from "@jonloucks/contracts-ts/api/ContractFactory";

import { assertGuard } from "@jonloucks/contracts-ts/test/helper.test.js";
import { Config, Contract } from "@jonloucks/contracts-ts/api/Contract";
import { OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";

describe('guard tests', () => {
  it('guard should return true for ContractFactory', () => {
    const instance: ContractFactory = {
      createContract: function <T>(config?: OptionalType<Config<T>>): RequiredType<Contract<T>> {
        used(config);
        throw new Error("Function not implemented.");
      }
    };
    ok(guard(instance), 'ContractFactory should return true');
  });
});

assertGuard(guard, "createContract");
