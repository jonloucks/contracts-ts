import { validateContracts } from "contracts-ts/api/auxiliary/Validate";
import { Contracts, Config as ContractsConfig } from "contracts-ts/api/Contracts";
import { createContracts } from "contracts-ts/impl/ContractsFactory.impl";

export { VERSION } from "contracts-ts/version";

export { AutoClose, AutoCloseMany, AutoCloseOne, AutoCloseType, typeToAutoClose } from "contracts-ts/api/AutoClose";
export { CONTRACT as AUTO_CLOSE_FACTORY, AutoCloseFactory } from "contracts-ts/api/AutoCloseFactory";
export { AutoOpen } from "contracts-ts/api/AutoOpen";
export { hasFunctions, isNotPresent, isNumber, isPresent, isString, OptionalType, RequiredType } from "contracts-ts/api/auxiliary/Types";
export { validateContracts } from "contracts-ts/api/auxiliary/Validate";
export { BindStrategy, DEFAULT_BIND_STRATEGY } from "contracts-ts/api/BindStrategy";
export { Contract, Config as ContractConfig } from "contracts-ts/api/Contract";
export { ContractException } from "contracts-ts/api/ContractException";
export { Contracts, Config as ContractsConfig } from "contracts-ts/api/Contracts";
export { ContractsFactory } from "contracts-ts/api/ContractsFactory";
export { Promisor, typeToPromisor } from "contracts-ts/api/Promisor";
export { CONTRACT as PROMISOR_FACTORY, PromisorFactory } from "contracts-ts/api/PromisorFactory";
export { Repository } from "contracts-ts/api/Repository";
export { CONTRACT as REPOSITORY_FACTORY, RepositoryFactory } from "contracts-ts/api/RepositoryFactory";

export { createContract, create as createContractFactory } from "contracts-ts/impl/ContractFactory.impl";
export { createContracts, create as createContractsFactory } from "contracts-ts/impl/ContractsFactory.impl";

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


