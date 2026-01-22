import { ok } from "node:assert";

import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { AutoCloseFactory } from "@jonloucks/contracts-ts/api/AutoCloseFactory";
import { AutoOpen } from "@jonloucks/contracts-ts/api/AutoOpen";
import { BasicContract } from "@jonloucks/contracts-ts/api/BasicContract";
import { BindStrategy } from "@jonloucks/contracts-ts/api/BindStrategy";
import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { ContractException } from "@jonloucks/contracts-ts/api/ContractException";
import { ContractFactory } from "@jonloucks/contracts-ts/api/ContractFactory";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { ContractsFactory } from "@jonloucks/contracts-ts/api/ContractsFactory";
import { Open } from "@jonloucks/contracts-ts/api/Open";
import { Promisor } from "@jonloucks/contracts-ts/api/Promisor";
import { PromisorFactory } from "@jonloucks/contracts-ts/api/PromisorFactory";
import { Repository } from "@jonloucks/contracts-ts/api/Repository";
import { RepositoryFactory } from "@jonloucks/contracts-ts/api/RepositoryFactory";
import { OptionalType } from "@jonloucks/contracts-ts/api/Types";

/** 
 * Tests for @jonloucks/contracts-ts/api index 
 * All exported functions and constants must already have been tested in their respective test files
 * These tests ensure that the index exports are correctly set up and accessible
 * If this file fails to compile, it indicates a possible breaking for deployment consumers
 * @module @jonloucks/contracts-ts/tests/contracts-ts-api.test.ts
 */

describe('contracts-ts/api Index exports', () => {
  it('should export all expected members', () => {
    assertNothing(null as OptionalType<AutoClose>);
    assertNothing(null as OptionalType<AutoCloseFactory>);
    assertNothing(null as OptionalType<AutoOpen>);
    assertNothing(null as OptionalType<BasicContract<string>>);
    assertNothing(null as OptionalType<BindStrategy>);
    assertNothing(null as OptionalType<Contract<string>>);
    assertNothing(null as OptionalType<ContractException>);
    assertNothing(null as OptionalType<ContractFactory>);
    assertNothing(null as OptionalType<Contracts>);
    assertNothing(null as OptionalType<ContractsFactory>);
    assertNothing(null as OptionalType<Open>)
    assertNothing(null as OptionalType<Promisor<string>>);
    assertNothing(null as OptionalType<PromisorFactory>);
    assertNothing(null as OptionalType<Repository>);
    assertNothing(null as OptionalType<RepositoryFactory>);
  });
});

function assertNothing(_value: OptionalType<unknown>): void {
  ok(true, 'This function is only for compile-time type checking and should never be called at runtime');
}
