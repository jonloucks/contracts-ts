import { RequiredType } from "./api/Types";
import { Contracts, Config as ContractsConfig } from "./api/Contracts";
import { Contract, Config as ContractConfig } from "./api/Contract";
import { create as createContractsFactory } from "./impl/ContractsFactoryImpl";       

export function createContracts(config?: ContractsConfig): RequiredType<Contracts> {
    return createContractsFactory().create(config);
}   

export function createContract<T>(config?: ContractConfig<T>): RequiredType<Contract<T>> {
    return Contract.create<T>(config);
}   

export { create as createContractsFactory } from "./impl/ContractsFactoryImpl";


