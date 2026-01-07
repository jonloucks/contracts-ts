export class StorageImpl<T> implements AutoClose {

    constructor(contracts: Contracts, contract: Contract<T>, promisor: Promisor<T | null>, bindStrategy: BindStrategy) {
        this.contracts = contracts;
        this.contract = contract;
        this.promisor = promisor;
        this.bindStrategy = bindStrategy;
    }
    [Symbol.dispose](): void {
       this.close();
    }

    bind(): void {
        this.close();
        this.closeBinding.set(this.contracts.bind(this.contract, this.promisor, this.bindStrategy));
    }

    close(): void {
        this.closeBinding.close();
    }

    private readonly contract: Contract<T>;
    private readonly promisor: Promisor<T | null>;
    private readonly bindStrategy: BindStrategy;
    private readonly contracts: Contracts;
    private readonly closeBinding: CloserImpl = new CloserImpl();
}

import { Contract } from "../api/Contract";
import { Contracts } from "../api/Contracts";
import { Promisor } from "../api/Promisor";
import { AutoClose } from "../api/AutoClose";
import { BindStrategy } from "../api/BindStrategy";

import { CloserImpl } from "./CloserImpl";
