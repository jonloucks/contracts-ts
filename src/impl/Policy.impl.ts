import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { ContractException } from "@jonloucks/contracts-ts/api/ContractException";
import { Config as ContractsConfig } from "@jonloucks/contracts-ts/api/Contracts";
import { isRatifiedContract } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { Policy } from "./Policy";

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
  if (ratified === false) {
    return (c: Contract<T>) => { used(c); };
  } else {
    return (contract: Contract<T>) => {
      if (isRatifiedContract(contract) === false) {
        throw new ContractException("Action denied: Only a ratified contract can be used.");
      }
    };
  }
}