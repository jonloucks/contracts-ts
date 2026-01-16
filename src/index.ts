export { VERSION } from "contracts-ts/version";

export { AutoClose, AutoCloseType, AutoCloseMany, AutoCloseOne, typeToAutoClose } from "contracts-ts/api/AutoClose";
export { AutoCloseFactory, CONTRACT as AUTO_CLOSE_FACTORY } from "contracts-ts/api/AutoCloseFactory";
export { AutoOpen } from "contracts-ts/api/AutoOpen";
export { OptionalType, RequiredType } from "contracts-ts/api/auxiliary/Types";
export { hasFunctions, isNotPresent, isNumber, isPresent, isString } from "contracts-ts/api/auxiliary/Types";
export { BindStrategy, DEFAULT_BIND_STRATEGY } from "contracts-ts/api/BindStrategy";
export { Contract, Config as ContractConfig } from "contracts-ts/api/Contract";
export { Contracts, Config as ContractsConfig } from "contracts-ts/api/Contracts";
export { ContractException } from "contracts-ts/api/ContractException";
export { ContractsFactory } from "contracts-ts/api/ContractsFactory";  
export { Promisor, typeToPromisor } from "contracts-ts/api/Promisor";
export { PromisorFactory, CONTRACT as PROMISOR_FACTORY } from "contracts-ts/api/PromisorFactory";
export { Repository } from "contracts-ts/api/Repository";
export { RepositoryFactory, CONTRACT as REPOSITORY_FACTORY } from "contracts-ts/api/RepositoryFactory";
export { validateContracts } from "contracts-ts/api/auxiliary/Validate";

export { createContract, create as createContractFactory } from "contracts-ts/impl/ContractFactory.impl";
export { createContracts, create as createContractsFactory } from "contracts-ts/impl/ContractsFactory.impl";


