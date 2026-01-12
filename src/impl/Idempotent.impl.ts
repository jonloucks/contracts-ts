import { AtomicBoolean } from "../api/AtomicBoolean";
import { create as createAtomicBoolean } from "./AtomicBoolean.impl";
import { Idempotent } from "./Idempotent";

export { Idempotent } from "./Idempotent";

/**
 * Factory to create an Idempotent implementation
 * 
 * @returns the new Idempotent implementation
 */
export function create(): Idempotent {
    return IdempotentImpl.internalCreate();
}

// ---- Implementation details below ----

const IS_CLOSED: boolean = false;
const IS_OPEN: boolean = true;

class IdempotentImpl implements Idempotent {

    transitionToOpen(): boolean {
        return this.state.compareAndSet(IS_CLOSED, IS_OPEN);
    }

    transitionToClosed(): boolean {
        return this.state.compareAndSet(IS_OPEN, IS_CLOSED);
    }

    isOpen(): boolean {
        return this.state.get() === IS_OPEN;
    }

    toString(): string {
        return `Idempotent[open:${this.state.get()}]`;
    }

    static internalCreate(): Idempotent {
        return new IdempotentImpl();
    }

    private constructor() {
        this.state.set(IS_CLOSED);
    }

    private readonly state: AtomicBoolean = createAtomicBoolean(IS_CLOSED);
}

