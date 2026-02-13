import { ok } from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";

import { Contracts, createContracts } from "@jonloucks/contracts-ts";
import { AUTO_CLOSE_NONE, AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { isPresent } from "@jonloucks/contracts-ts/api/Types";
import { Config as IdempotenConfig, Idempotent, guard as idempotentGuard } from "@jonloucks/contracts-ts/auxiliary/Idempotent";
import { CONTRACT, IdempotentFactory, guard } from "@jonloucks/contracts-ts/auxiliary/IdempotentFactory";
import { assertContract, assertGuard } from "@jonloucks/contracts-ts/test/helper.test";

const FUNCTION_NAMES: (string | symbol)[] = [
  'createIdempotent'
];

assertGuard(guard, ...FUNCTION_NAMES);

assertContract(CONTRACT, 'IdempotentFactory');

describe('IdempotentFactory Tests', () => {
  let contracts: Contracts;
  let closeContracts: AutoClose;
  let factory: IdempotentFactory;

  beforeEach(() => {
    contracts = createContracts();
    closeContracts = contracts.open();
    factory = contracts.enforce(CONTRACT);
  });

  afterEach(() => {
    closeContracts?.close();
  });

  it('isIdempotentFactory should return true for IdempotentFactory', () => {
    ok(guard(factory), 'IdempotentFactory should return true');
  });

  it('createIdempotent should create a Idempotent instance', () => {
    const config: IdempotenConfig = {
      open: () => AUTO_CLOSE_NONE // a simple noop open function
    };
    const idempotent: Idempotent = factory.createIdempotent(config);
    ok(idempotent, 'Idempotent instance should be created');
    ok(idempotentGuard(idempotent), 'Created instance should be Idempotent');
    ok(isPresent(idempotent.getState()), 'Idempotent should have a state');
  });
});
