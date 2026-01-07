export function create(contracts: Contracts): RequiredType<RepositoryFactory> {
    return RepositoryFactoryImpl.internalCreate(contracts);
}

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

import { Contracts } from "../api/Contracts";
import { RequiredType } from "../api/Types";
import { Repository } from "../api/Repository";
import { create as createRepository } from "./RepositoryImpl";
import { RepositoryFactory } from "../api/RepositoryFactory";