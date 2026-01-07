import { RequiredType } from "./api/Types";
import { Contracts, Config as ContractsConfig } from "./api/Contracts";
import { create as createContractsFactory } from "./impl/ContractsFactoryImpl";  

export function createContracts(config?: ContractsConfig): RequiredType<Contracts> {
    return createContractsFactory().create(config);
}   

export { create as createContract } from "./api/RatifiedContract"; 
export { create as createContractsFactory } from "./impl/ContractsFactoryImpl";


