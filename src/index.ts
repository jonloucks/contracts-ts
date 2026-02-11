import { Contracts, Config as ContractsConfig } from "@jonloucks/contracts-ts/api/Contracts";
import { validateContracts } from "@jonloucks/contracts-ts/auxiliary/Validate";

export { type AutoClose, type AutoCloseMany, type AutoCloseOne, type AutoCloseType, typeToAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
export { CONTRACT as AUTO_CLOSE_FACTORY, type AutoCloseFactory } from "@jonloucks/contracts-ts/api/AutoCloseFactory";
export { type AutoOpen } from "@jonloucks/contracts-ts/api/AutoOpen";
export { type BindStrategy, DEFAULT_BIND_STRATEGY } from "@jonloucks/contracts-ts/api/BindStrategy";
export { type Contract, type Config as ContractConfig } from "@jonloucks/contracts-ts/api/Contract";
export { ContractException } from "@jonloucks/contracts-ts/api/ContractException";
export { type Contracts, type Config as ContractsConfig } from "@jonloucks/contracts-ts/api/Contracts";
export { type ContractsFactory } from "@jonloucks/contracts-ts/api/ContractsFactory";
export { type Promisor, typeToPromisor } from "@jonloucks/contracts-ts/api/Promisor";
export { CONTRACT as PROMISOR_FACTORY, type PromisorFactory } from "@jonloucks/contracts-ts/api/PromisorFactory";
export { type Repository } from "@jonloucks/contracts-ts/api/Repository";
export { CONTRACT as REPOSITORY_FACTORY, type RepositoryFactory } from "@jonloucks/contracts-ts/api/RepositoryFactory";
export { guardFunctions as hasFunctions, isNotPresent, isNumber, isPresent, isString, type OptionalType, type RequiredType } from "@jonloucks/contracts-ts/api/Types";
export { validateContracts } from "@jonloucks/contracts-ts/auxiliary/Validate";

//  no qualified paths for things not exposed publicly
import { createContracts, create as createContractsFactory } from "./impl/ContractsFactory.impl";
export { createContract, create as createContractFactory } from "./impl/ContractFactory.impl";
export { VERSION } from "./version";

export { createContracts, createContractsFactory };


/**
 * A shared global Contracts instance.
 * 
 * All Contract references are hidden and not exposed outside of this instance.
 * Bound Contract promisors are also hidden and not exposed outside of this instance.
 * By default, A Contract (replaceable = false) can NOT be replaced once bound.
 * 
 * Note: accepts only ratified contracts and closes on process exit.
 */
export const CONTRACTS : Contracts = (() : Contracts => {
    const globalConfig : ContractsConfig = { 
      ratified: true,
      shutdownEvents: ['exit']
    };
    const contracts = createContracts(globalConfig);
    contracts.open(); // closed on exit
    validateContracts(contracts);
    return contracts;
})();


