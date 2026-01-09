import { Contract, Config } from '../api/Contract';
import { isNullOrUndefined, RequiredType, OptionalType, isNotNullOrUndefined } from '../api/Types';
import { create as createRatifiedContract } from '../api/RatifiedContract';
import { create as createBasicContract } from '../api/BasicContract';
import { isRatifiableConfig } from '../api/RatifiedContract';

import { ContractFactory } from '../api/ContractFactory';

export function create(): RequiredType<ContractFactory> {
    return ContractFactoryImpl.internalCreate();
}

export function createContract<T>(config?: OptionalType<Config<T>>): RequiredType<Contract<T>> {
    return create().create<T>(config);
}

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