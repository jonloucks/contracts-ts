import { CONTRACT as AUTO_CLOSE_FACTORY } from "@jonloucks/contracts-ts/api/AutoCloseFactory";
import { Contracts, Config as ContractsConfig } from "@jonloucks/contracts-ts/api/Contracts";
import { ContractsFactory } from "@jonloucks/contracts-ts/api/ContractsFactory";
import { CONTRACT as PROMISOR_FACTORY } from "@jonloucks/contracts-ts/api/PromisorFactory";
import { Repository } from "@jonloucks/contracts-ts/api/Repository";
import { CONTRACT as REPOSITORY_FACTORY, RepositoryFactory } from "@jonloucks/contracts-ts/api/RepositoryFactory";
import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { CONTRACT as ATOMIC_BOOLEAN_FACTORY } from "@jonloucks/contracts-ts/auxiliary/AtomicBooleanFactory";
import { CONTRACT as ATOMIC_INTEGER_FACTORY } from "@jonloucks/contracts-ts/auxiliary/AtomicIntegerFactory";
import { CONTRACT as ATOMIC_REFERENCE_FACTORY } from "@jonloucks/contracts-ts/auxiliary/AtomicReferenceFactory";

import { create as createAtomicBooleanFactoryImpl } from "./AtomicBooleanFactory.impl";
import { create as createAtomicIntegerFactoryImpl } from "./AtomicIntegerFactory.impl";
import { create as createAtomicReferenceFactoryImpl } from "./AtomicReferenceFactory.impl";
import { create as createAutoCloseFactoryImpl } from "./AutoCloseFactory.impl";
import { create as createContractsImpl } from "./Contracts.impl";
import { wrap as wrapContracts } from "./ContractsWrapper.impl";
import { create as createPromisorFactoryImpl } from "./PromisorFactory.impl";
import { create as createRepositoryFactoryImpl } from "./RepositoryFactory.impl";

/**
 * Factory method to create a ContractsFactory
 * 
 * @returns the ContractsFactory implementation
 */
export function create(): RequiredType<ContractsFactory> {
  return ContractsFactoryImpl.internalCreate();
}

/**
 * Factory method to create Contracts instance.
 * 
 * @param config the configuration for the Contracts instance
 * @returns the Contracts implementation
 */
export function createContracts(config?: ContractsConfig): RequiredType<Contracts> {
  return create().create(config);
}

// ---- Implementation details below ----

/**
 * Implementation for ContractsFactory
 */
class ContractsFactoryImpl implements ContractsFactory {

  /**
   * ContractsFactory.create override
   */
  create(config?: ContractsConfig): RequiredType<Contracts> {
    const actualConfig: RequiredType<ContractsConfig> = config ?? this.defaultConfig;
    const contracts: RequiredType<Contracts> = createContractsImpl(actualConfig);
    const repository: RequiredType<Repository> = this.createKernelRepository(contracts);

    return wrapContracts(contracts, repository);
  }

  static internalCreate(): RequiredType<ContractsFactory> {
    return new ContractsFactoryImpl();
  }

  private createKernelRepository(contracts: Contracts): RequiredType<Repository> {
    const repositoryFactory: RequiredType<RepositoryFactory> = createRepositoryFactoryImpl(contracts);
    const repository: RequiredType<Repository> = repositoryFactory.create();

    repository.keep(PROMISOR_FACTORY, createPromisorFactoryImpl);
    repository.keep(REPOSITORY_FACTORY, () => repositoryFactory);
    repository.keep(ATOMIC_BOOLEAN_FACTORY, createAtomicBooleanFactoryImpl);
    repository.keep(ATOMIC_INTEGER_FACTORY, createAtomicIntegerFactoryImpl);
    repository.keep(ATOMIC_REFERENCE_FACTORY, createAtomicReferenceFactoryImpl);
    repository.keep(AUTO_CLOSE_FACTORY, createAutoCloseFactoryImpl);

    return repository;
  }

  private constructor() {
    //  empty
  }

  private defaultConfig: RequiredType<ContractsConfig> = {};
}
