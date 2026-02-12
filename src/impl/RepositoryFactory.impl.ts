import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { Config, Repository } from "@jonloucks/contracts-ts/api/Repository";
import { RepositoryFactory } from "@jonloucks/contracts-ts/api/RepositoryFactory";
import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { create as createRepository } from "./Repository.impl.js";

/**
 * Factory method to create a RepositoryFactory
 * 
 * @param contracts the Contracts instance to be used by the RepositoryFactory
 * @returns the RepositoryFactory implementation
 */
export function create(contracts: Contracts): RequiredType<RepositoryFactory> {
  return RepositoryFactoryImpl.internalCreate(contracts);
}

// ---- Implementation details below ----

/**
 * The RepositoryFactory implementation
 */
class RepositoryFactoryImpl implements RepositoryFactory {

  createRepository(config?: Config): RequiredType<Repository> {
    const validConfig: Config =  {...(config ?? {})};

    if (!validConfig.contracts) {
      validConfig.contracts = this.contracts;
    }

    return createRepository(validConfig);
  }

  static internalCreate(contracts: Contracts): RequiredType<RepositoryFactory> {
    return new RepositoryFactoryImpl(contracts);
  }

  private constructor(contracts: Contracts) {
    this.contracts = contracts;
  }

  private readonly contracts: Contracts;
}
