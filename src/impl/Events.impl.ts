import { RequiredType } from "../api/Types";
import { AutoOpen } from "../api/AutoOpen";
import { AUTO_CLOSE_NONE, AutoClose, inlineAutoClose } from "../api/AutoClose";
import { IdempotentImpl } from "./Indempotent.impl";
import { configCheck, presentCheck } from "../api/Checks";

export interface Config {
    names?: string[];

    callback: (...args: unknown[]) => void;
}

export interface Events extends AutoOpen {
    get opened(): boolean;
};

export function create(config?: Config): RequiredType<Events> {
    return EventsImpl.internalCreate(config);
}

// ---- Implementation details below ----

class EventsImpl implements Events {

    open(): AutoClose {
        if (this.openState.transitionToOpen()) {
            return this.firstOpen();
        } else {
            return AUTO_CLOSE_NONE
        }
    }

    get opened(): boolean {
        return this.openState.isOpen();
    }

    static internalCreate(config?: Config): RequiredType<Events> {
        return new EventsImpl(config);
    }

    private firstOpen(): AutoClose {
        this.names.forEach(name => {
            process.on(name, this.callback);
        });

        return inlineAutoClose(() => {
            if (this.openState.transitionToClosed()) {
                this.names.forEach(name => {
                    process.off(name, this.callback);
                });
            }
        });
    }

    private constructor(config?: Config) {
        const validConfig = configCheck(config);
        this.names = validConfig?.names ?? [];
        this.callback = presentCheck(validConfig?.callback, "Callback must be present.")
    }

    private readonly names: string[];
    private readonly callback: (...args: unknown[]) => void;
    private readonly openState: IdempotentImpl = new IdempotentImpl();
}

