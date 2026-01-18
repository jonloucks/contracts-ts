import { create as createBasicContract } from "@jonloucks/contracts-ts/api/BasicContract";
import { Config, Contract } from "@jonloucks/contracts-ts/api/Contract";
import { create as createRatifiedContract, isRatifiableConfig } from "@jonloucks/contracts-ts/api/RatifiedContract";
import { OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";

import { ContractFactory } from "@jonloucks/contracts-ts/api/ContractFactory";

/**
 * Factory method to create a ContractFactory
 * 
 * @returns the new ContractFactory implementation
 */
export function create(): RequiredType<ContractFactory> {
  return ContractFactoryImpl.internalCreate();
}

/**
 * Factory method to create a Contract
 * @param config optional Contract configuration
 * @returns the new Contract implementation
 */
export function createContract<T>(config?: OptionalType<Config<T>>): RequiredType<Contract<T>> {
  return create().create<T>(config);
}

// ---- Implementation details below ----

/**
 * An implementation of ContractFactory
 */
class ContractFactoryImpl implements ContractFactory {
  create<T>(config?: OptionalType<Config<T>>): RequiredType<Contract<T>> {
    if (config?.ratified === true || isRatifiableConfig<T>(config)) {
      return createRatifiedContract<T>(config);
    } else {
      return createBasicContract<T>(config);
    }
  }

  private constructor() {
  }

  static internalCreate(): RequiredType<ContractFactory> {
    return new ContractFactoryImpl();
  }
};