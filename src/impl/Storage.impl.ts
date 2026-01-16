import { AutoClose, AutoCloseOne } from "@io.github.jonloucks/contracts-ts/api/AutoClose";
import { BindStrategy } from "@io.github.jonloucks/contracts-ts/api/BindStrategy";
import { Contract } from "@io.github.jonloucks/contracts-ts/api/Contract";
import { Contracts } from "@io.github.jonloucks/contracts-ts/api/Contracts";
import { Promisor } from "@io.github.jonloucks/contracts-ts/api/Promisor";

import { create as createAutoCloseOne } from "@io.github.jonloucks/contracts-ts/impl/AutoCloseOne.impl";

// ---- Implementation details below ----

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
  private readonly closeBinding: AutoCloseOne = createAutoCloseOne();
}
