import { isNotPresent, RequiredType } from "../api/Types";
import { Policy } from "../impl/Policy";
import { Contract } from "../api/Contract";
import { Config as ContractsConfig } from "../api/Contracts";
import { isRatifiedContract } from "../api/RatifiedContract";
import { ContractException } from "../api/ContractException";

export { Policy } from "../impl/Policy";
export { RequiredType } from "../api/Types";

/**
 * Factory method to create Policy instance.
 * 
 * @param config the configuration for the Policy instance
 * @returns the Policy implementation
 */
export function create(config?: ContractsConfig): RequiredType<Policy> {
    return {
        checkContract: compileContractCheck(config)
    };
}

// ---- Implementation details below ----

function compileContractCheck<T>(config?: ContractsConfig): (contract: Contract<T>) => void {
    const ratified: boolean = config?.ratified ?? true;
    if (isNotPresent(config) || ratified === false) {
        return (_: Contract<T>) => { /* no-op */ };
    } else {
        return (contract: Contract<T>) => {
            if (isRatifiedContract(contract) === false) {
                throw new ContractException("Action denied: Only a ratified contract can be used.");
            }
        };
    }
}