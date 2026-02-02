import { AUTO_CLOSE_NONE, AutoClose, inlineAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { configCheck, presentCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { Idempotent, create as createIdempotent } from "./DeprecatedIdempotent.impl";
import { AutoOpen, Config, Events } from "./Events";

export { Config, Events } from "./Events";

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
    if (this.idempotent.transitionToOpen()) {
      return this.firstOpen();
    } else {
      return AUTO_CLOSE_NONE
    }
  }

  isOpen(): boolean {
    return this.idempotent.isOpen();
  }

  static internalCreate(config?: Config): RequiredType<Events> {
    return new EventsImpl(config);
  }

  private firstOpen(): AutoClose {
    this.names.forEach(name => {
      process.on(name, this.callback);
    });

    return inlineAutoClose(() => {
      this.closeFirstOpen()
    });
  }

  private closeFirstOpen(): void {
    if (this.idempotent.transitionToClosed()) {
      this.names.forEach(name => {
        process.off(name, this.callback);
      });
    }
  }

  private constructor(config?: Config) {
    const validConfig = configCheck(config);
    this.names = validConfig?.names ?? [];
    this.callback = presentCheck(validConfig?.callback, "Callback must be present.")
  }

  private readonly names: string[];
  private readonly callback: (...args: unknown[]) => void;
  private readonly idempotent: Idempotent = createIdempotent();
}

