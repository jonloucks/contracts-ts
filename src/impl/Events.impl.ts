import { AutoClose, AutoCloseType } from "@jonloucks/contracts-ts/api/AutoClose";
import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { configCheck, presentCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { Idempotent } from "@jonloucks/contracts-ts/auxiliary/Idempotent";

import { create as createIdempotent } from "./Idempotent.impl";
import { AutoOpen, Config, Events } from "./Events";

export { Config, Events };

/**
 *  Factory method to create Events instance.
 * 
 * @param config the configuration for the Events implementation
 * @returns the new Events implementation
 */
export function create(config?: Config): RequiredType<Events> {
  return EventsImpl.internalCreate(config);
}

// ---- Implementation details below ----

/**
 * The Events implementation
 */
class EventsImpl implements Events, AutoOpen {

  autoOpen(): AutoClose {
    return this.open();
  }

  open(): AutoClose {
    return this.#idempotent.open();
  }

  isOpen(): boolean {
    return this.#idempotent.isOpen();
  }

  static internalCreate(config?: Config): RequiredType<Events> {
    return new EventsImpl(config);
  }

  private firstOpen(): AutoCloseType {
    this.#names.forEach(name => {
      process.on(name, this.#callback);
    });

    return () => {
      this.#names.forEach(name => {
        process.off(name, this.#callback);
      });
    };
  }

  private constructor(config?: Config) {
    const validConfig = configCheck(config);
    this.#names = validConfig?.names ?? [];
    this.#callback = presentCheck(validConfig?.callback, "Callback must be present.")
  }

  readonly #names: string[];
  readonly #callback: (...args: unknown[]) => void;
  readonly #idempotent: Idempotent = createIdempotent({ open: () => this.firstOpen()});
}

