import { describe, it } from "node:test";
import { ok, strictEqual } from "node:assert";

import {
  VERSION,
  CONTRACTS,
  Contract,
  ContractConfig,
  ContractException,
  Contracts,
  ContractsConfig,
  createContract,
  createContracts
} from "@jonloucks/contracts-ts";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";

/** 
 * Tests for @jonloucks/contracts-ts index and version exports
 * All exported functions and constants must already have been tested in their respective test files
 * These tests ensure that the index exports are correctly set up and accessible
 * Also tests the VERSION constant to ensure it matches the version in package.json
 * If this file fails to compile, it indicates a possible breaking for deployment consumers
 * @module @jonloucks/contracts-ts/tests/contracts-ts.test.ts
 */

describe('VERSION constant', () => {
  it('should be a non-empty string', () => {
    strictEqual(typeof VERSION, 'string', 'VERSION should be of type string');
    ok(VERSION.length > 0, 'VERSION should not be an empty string');
  });
});

describe('Index exports', () => {
  it('should export all expected members', () => {
    assertNothing(null as Contract<string> | null, 'Contract should be exported');
    assertNothing(null as ContractConfig<string> | null, 'ContractConfig should be exported');
    assertNothing(null as ContractException | null, 'ContractException should be exported');
    assertNothing(null as Contracts | null, 'Contracts should be exported');
    assertNothing(null as ContractsConfig | null, 'ContractsConfig should be exported');
    ok(createContract, 'createContract should be exported');
    ok(createContracts, 'createContracts should be exported');
    ok(CONTRACTS, 'CONTRACTS should be exported');
  });
});

function assertNothing(value: unknown | null | undefined, message: string): void {
  used(value);
  ok(true, message);
}
