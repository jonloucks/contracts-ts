import { Contracts } from "contracts-ts/api/Contracts";
import { Repository } from "contracts-ts/api/Repository";
import { RepositoryFactory } from "contracts-ts/api/RepositoryFactory";
import { RequiredType } from "contracts-ts/api/auxiliary/Types";
import { create as createRepository } from "contracts-ts/impl/Repository.impl";

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

  create(): RequiredType<Repository> {
    return createRepository(this.contracts);
  }

  static internalCreate(contracts: Contracts): RequiredType<RepositoryFactory> {
    return new RepositoryFactoryImpl(contracts);
  }

  private constructor(contracts: Contracts) {
    this.contracts = contracts;
  }

  private readonly contracts: Contracts;
}
