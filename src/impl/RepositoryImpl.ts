/**
 * Factory method to create Repository instance.
 * 
 * @param contracts the Contracts instance to be used by the Repository
 * @returns the Repository implementation
 */
export function create(contracts: Contracts): RequiredType<Repository> {
    return RepositoryImpl.internalCreate(contracts);
}

/**
 * Implementation for {@link io.github.jonloucks.contracts.api.Repository}
 * @see io.github.jonloucks.contracts.api.Repository
 */
class RepositoryImpl implements Repository {
    
    /**
     * AutoOpen.open override.
     */
    open() : AutoClose {
        if (this.openState.transitionToOpen()) {
            for (const storage of this.#storedContracts.values()) {
                storage.bind();
            }
            this.check();
            return inlineAutoClose(() => this.close());
        }
        return AUTO_CLOSE_NONE;
    }
    
    /**
     * Repository.store override.
     */
    store<T>( contract: Contract<T>, promisor: PromisorType<T>, bindStrategy?: BindStrategy | undefined | null) : AutoClose {
        const validContract: Contract<T> = contractCheck(contract);
        const validPromisor: Promisor<T> = typeToPromisor(promisor);
        const validBindStrategy: BindStrategy = resolveBindStrategy(bindStrategy);
        
        if (this.#storedContracts.has(validContract) && this.openState.isOpen()) {
            throw new ContractException( "The contract " + validContract + "  is already stored.");
        }
        
        const storage: StorageImpl<T | null> = new StorageImpl<T | null>(this.contracts, validContract, validPromisor, validBindStrategy);
        
        if (this.openState.isOpen()) {
            storage.bind();
        }
        
        this.#storedContracts.set(validContract, storage);
  
        return inlineAutoClose(() => {
            if (this.#storedContracts.get(validContract) === storage) {
                this.#storedContracts.delete(validContract);
                storage.close();
            }
        });
    }

    /**
     * Repository.keep override.
     */
    keep<T>(contract: Contract<T>, promisor: PromisorType<T>, bindStrategy?: OptionalType<BindStrategy>) : void {
        this.store(contract, promisor, resolveBindStrategy(bindStrategy));
    }

    /**
     * Repository.check override.
     */
    check() : void {
        this.#requiredContracts.forEach((contract) => {
            if (!this.contracts.isBound(contract)) {
                throw new ContractException( "The contract " + contract + " is required.");
            }
        });
    }
    
     /**
     * Repository.require override.
     */
    require<T>(contract: Contract<T>) : void {
        const validContract : Contract<T> = contractCheck(contract);
        
        this.#requiredContracts.add(validContract);
    }

    /**
     * Object.toString override.
     */
    toString(): string {
        return `Repository[size: ${this.#storedContracts.size}]`;
    }
     
    private constructor(contracts: Contracts) {
        this.contracts = contracts;
    }
  
    private close() : void {
        if (this.openState.transitionToClosed()) {
            this.reverseCloseStorage();
        }
    }
    
    private reverseCloseStorage() : void {
        const storageStack: StorageImpl<unknown>[] = [];
        for (const storage of this.#storedContracts.values()) {
            storageStack.push(storage);
        }
        try {
            while (storageStack.length > 0) {
                storageStack.pop()!.close();
            }
        } finally {
            this.#storedContracts.clear();
        }
    }

    static internalCreate(contracts: Contracts) : RequiredType<Repository> {
        return new RepositoryImpl(contracts);
    }
    
    private static ID_GENERATOR: number = 1000;
    private readonly id: number = RepositoryImpl.ID_GENERATOR++;
    readonly #storedContracts = new Map<Contract<unknown>, StorageImpl<unknown>>();    
    private readonly contracts: Contracts;
    private readonly openState: IdempotentImpl = new IdempotentImpl();
    readonly #requiredContracts: Set<Contract<unknown>> = new Set<Contract<unknown>>();
}

import { RequiredType } from "../api/Types";
import { Contract } from "../api/Contract";
import { Contracts } from "../api/Contracts";
import { Promisor, PromisorType, typeToPromisor } from "../api/Promisor";
import { Repository } from "../api/Repository";
import { AUTO_CLOSE_NONE, AutoClose, inlineAutoClose } from "../api/AutoClose";
import { BindStrategy, resolveBindStrategy } from "../api/BindStrategy";
import { contractCheck } from "../api/Checks";
import { ContractException } from "../api/ContractException";

import { StorageImpl } from "./StorageImpl";
import { IdempotentImpl } from "./IndempotentImpl";
import { OptionalType } from "../api/Types";

