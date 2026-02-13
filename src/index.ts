import { type Contracts, type Config as ContractsConfig } from "@jonloucks/contracts-ts/api/Contracts";
import { validateContracts } from "@jonloucks/contracts-ts/auxiliary/Validate";
import { ContractException } from "@jonloucks/contracts-ts/api/ContractException";
import { type Contract, type Config as ContractConfig } from "@jonloucks/contracts-ts/api/Contract";
import { createContracts } from "./impl/ContractsFactory.impl.js";
import { createContract } from "./impl/ContractFactory.impl.js";
import { VERSION } from "./version.js";

/**
 * A shared global Contracts instance.
 * 
 * All Contract references are hidden and not exposed outside of this instance.
 * Bound Contract promisors are also hidden and not exposed outside of this instance.
 * By default, A Contract (replaceable = false) can NOT be replaced once bound.
 * 
 * Note: accepts only ratified contracts and closes on process exit.
 */
const CONTRACTS: Contracts = ((): Contracts => {
  const globalConfig: ContractsConfig = {
    ratified: true,
    shutdownEvents: ['exit']
  };
  const contracts = createContracts(globalConfig);
  contracts.open(); // closed on exit
  validateContracts(contracts);
  return contracts;
})();

// decide on what to export from this module. For now, only the essential functions and the shared global instance are exported.
export {
  VERSION,
  CONTRACTS,
  Contract,
  ContractConfig,
  ContractException,
  Contracts,
  ContractsConfig,
  createContract,
  createContracts
};



