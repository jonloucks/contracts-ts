import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { IdempotentFactory } from "@jonloucks/contracts-ts/auxiliary/IdempotentFactory";
import { Idempotent, Config as IdempotentConfig } from "@jonloucks/contracts-ts/auxiliary/Idempotent";
import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { used } from "@jonloucks/contracts-ts/auxiliary/Checks";

import { create as createIdempotentImpl } from "./Idempotent.impl.js";

export interface Config {
  contracts?: Contracts;
}
  
/**
 * Create a new IdempotentFactory
 *
 * @return the new IdempotentFactory
 */
export function create(config?: Config): IdempotentFactory {
  return IdempotentFactoryImpl.internalCreate(config);
}

// ---- Implementation details below ----

class IdempotentFactoryImpl implements IdempotentFactory {
  
  createIdempotent(config: IdempotentConfig): RequiredType<Idempotent> {
    return createIdempotentImpl(config);
  }

  static internalCreate(config?: Config): IdempotentFactory {
    return new IdempotentFactoryImpl(config);
  }

  private constructor(config?: Config) {
    used(config);
  }
};