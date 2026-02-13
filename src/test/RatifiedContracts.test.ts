import { describe, it } from "node:test";
import { throws } from "node:assert";

import { createContract } from "@jonloucks/contracts-ts";
import { Contracts, Config as ContractsConfig } from "@jonloucks/contracts-ts/api/Contracts";
import { Type as PromisorType } from "@jonloucks/contracts-ts/api/Promisor";
import { Tools } from "@jonloucks/contracts-ts/test/Test.tools.test";

describe('Contracts with ratified', () => {

  it('bind with unratified contract should throw ContractException', () => {
    const contractsConfig: ContractsConfig = { ratified: true };
    const contract = createContract<string>();
    const promisor: PromisorType<string> = () => "Hello World";
    Tools.withConfiguredContracts(contractsConfig, (contracts: Contracts) => {
      throws(() => {
        contracts.bind(contract, promisor);
      }, {
        name: 'ContractException',
        message: /ratified/
      });
    });
  });

  it('isBound with unratified contract should throw ContractException', () => {
    const contractsConfig: ContractsConfig = { ratified: true };
    const contract = createContract<string>();
    Tools.withConfiguredContracts(contractsConfig, (contracts: Contracts) => {
      throws(() => {
        contracts.isBound(contract);
      }, {
        name: 'ContractException',
        message: /ratified/
      });
    });
  });

  it('claim with unratified contract should throw ContractException', () => {
    const contractsConfig: ContractsConfig = { ratified: true };
    const contract = createContract<string>();
    Tools.withConfiguredContracts(contractsConfig, (contracts: Contracts) => {
      throws(() => {
        contracts.claim(contract);
      }, {
        name: 'ContractException',
        message: /ratified/
      });
    });
  });

  it('enforce with unratified contract should throw ContractException', () => {
    const contractsConfig: ContractsConfig = { ratified: true };
    const contract = createContract<string>();
    Tools.withConfiguredContracts(contractsConfig, (contracts: Contracts) => {
      throws(() => {
        contracts.enforce(contract);
      }, {
        name: 'ContractException',
        message: /ratified/
      });
    });
  });
});
