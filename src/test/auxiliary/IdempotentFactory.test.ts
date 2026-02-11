import { ok } from "node:assert";

import { CONTRACT, IdempotentFactory, guard } from "@jonloucks/contracts-ts/auxiliary/IdempotentFactory";
import { AutoClose, Contracts, createContracts, isPresent } from "@jonloucks/contracts-ts";
import { Idempotent, Config as IdempotenConfig, guard as idempotentGuard } from "@jonloucks/contracts-ts/auxiliary/Idempotent";
import { assertContract, assertGuard } from "@jonloucks/contracts-ts/test/helper.test.js";
import { AUTO_CLOSE_NONE } from "@jonloucks/contracts-ts/api/AutoClose";

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
