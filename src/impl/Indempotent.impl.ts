const IS_CLOSED: boolean = false;
const IS_OPEN: boolean = true;
export class IdempotentImpl {

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

    constructor() {
        this.state.set(IS_CLOSED);
    }

    private readonly state: AtomicBoolean = createAtomicBoolean(IS_CLOSED);
}

import { AtomicBoolean } from "../api/AtomicBoolean";
import { create as createAtomicBoolean } from "./AtomicBoolean.impl";
