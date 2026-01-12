import { AUTO_CLOSE_NONE, AutoClose, inlineAutoClose } from "../api/AutoClose";
import { configCheck, presentCheck } from "../api/Checks";
import { RequiredType } from "../api/Types";
import { Config, Events } from "../impl/Events";
import { Idempotent, create as createIdempotent } from "./Idempotent.impl";

export { Config, Events } from "../impl/Events";

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

class EventsImpl implements Events {

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

