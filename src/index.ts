import { validateContracts } from "@jonloucks/contracts-ts/api/auxiliary/Validate";
import { Contracts, Config as ContractsConfig } from "@jonloucks/contracts-ts/api/Contracts";
import { createContracts } from "@jonloucks/contracts-ts/impl/ContractsFactory.impl";

export { VERSION } from "@jonloucks/contracts-ts/version";

export { AutoClose, AutoCloseMany, AutoCloseOne, AutoCloseType, typeToAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
export { CONTRACT as AUTO_CLOSE_FACTORY, AutoCloseFactory } from "@jonloucks/contracts-ts/api/AutoCloseFactory";
export { AutoOpen } from "@jonloucks/contracts-ts/api/AutoOpen";
export { validateContracts } from "@jonloucks/contracts-ts/api/auxiliary/Validate";
export { BindStrategy, DEFAULT_BIND_STRATEGY } from "@jonloucks/contracts-ts/api/BindStrategy";
export { Contract, Config as ContractConfig } from "@jonloucks/contracts-ts/api/Contract";
export { ContractException } from "@jonloucks/contracts-ts/api/ContractException";
export { Contracts, Config as ContractsConfig } from "@jonloucks/contracts-ts/api/Contracts";
export { ContractsFactory } from "@jonloucks/contracts-ts/api/ContractsFactory";
export { Promisor, typeToPromisor } from "@jonloucks/contracts-ts/api/Promisor";
export { CONTRACT as PROMISOR_FACTORY, PromisorFactory } from "@jonloucks/contracts-ts/api/PromisorFactory";
export { Repository } from "@jonloucks/contracts-ts/api/Repository";
export { CONTRACT as REPOSITORY_FACTORY, RepositoryFactory } from "@jonloucks/contracts-ts/api/RepositoryFactory";
export { hasFunctions, isNotPresent, isNumber, isPresent, isString, OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";

export { createContract, create as createContractFactory } from "@jonloucks/contracts-ts/impl/ContractFactory.impl";
export { createContracts, create as createContractsFactory } from "@jonloucks/contracts-ts/impl/ContractsFactory.impl";

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


