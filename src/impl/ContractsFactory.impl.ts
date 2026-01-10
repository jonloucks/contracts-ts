import { RequiredType } from "../api/Types";
import { ContractsFactory } from "../api/ContractsFactory";
import { CONTRACT as ATOMIC_BOOLEAN_FACTORY } from "../api/AtomicBooleanFactory";
import { CONTRACT as ATOMIC_INTEGER_FACTORY } from '../api/AtomicIntegerFactory';
import { CONTRACT as ATOMIC_REFERENCE_FACTORY } from "../api/AtomicReferenceFactory";
import { Contracts, Config as ContractsConfig } from "../api/Contracts";
import { CONTRACT as PROMISOR_FACTORY } from "../api/PromisorFactory";
import { Repository } from "../api/Repository";
import { CONTRACT as REPOSITORY_FACTORY, RepositoryFactory } from "../api/RepositoryFactory";

import { create as createContractsImpl } from "./Contracts.impl";
import { create as createAtomicBooleanFactoryImpl } from "./AtomicBooleanFactory.impl";
import { create as createAtomicIntegerFactoryImpl } from "./AtomicIntegerFactory.impl";
import { create as createAtomicReferenceFactoryImpl } from "./AtomicReferenceFactory.impl";
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
        const repository: RequiredType<Repository> = ContractsFactoryImpl.createKernelRepository(contracts);

        // revisit: no resources to close, but repository should be closed later
        repository.open();

        return contracts;
    }

    static internalCreate(): RequiredType<ContractsFactory> {
        return new ContractsFactoryImpl();
    }

    private constructor() {
        //  empty
    }

    private static createKernelRepository(contracts: Contracts): RequiredType<Repository> {
        const repositoryFactory: RequiredType<RepositoryFactory> = createRepositoryFactoryImpl(contracts);
        const repository: RequiredType<Repository> = repositoryFactory.create();

        repository.keep(PROMISOR_FACTORY, createPromisorFactoryImpl);
        repository.keep(REPOSITORY_FACTORY, () => repositoryFactory);
        repository.keep(ATOMIC_BOOLEAN_FACTORY, createAtomicBooleanFactoryImpl);
        repository.keep(ATOMIC_INTEGER_FACTORY, createAtomicIntegerFactoryImpl);
        repository.keep(ATOMIC_REFERENCE_FACTORY, createAtomicReferenceFactoryImpl);

        return repository;
    }

    private defaultConfig: RequiredType<ContractsConfig> = {};
}
