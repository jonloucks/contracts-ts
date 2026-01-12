import { AtomicReference } from "../api/AtomicReference";
import { AutoClose, AutoCloseOne, AutoCloseType, typeToAutoClose } from "../api/AutoClose";
import { isPresent, RequiredType, OptionalType } from "../api/Types";
import { create as createAtomicReference } from "./AtomicReference.impl";

export function create(): RequiredType<AutoCloseOne> {
    return AutoCloseOneImpl.internalCreate();
}

class AutoCloseOneImpl implements AutoCloseOne {
    close(): void {
        let autoClose = this.reference.get();
        if (isPresent(autoClose) && this.reference.compareAndSet(autoClose, null)) {
            autoClose.close();
        }
    }

    [Symbol.dispose](): void {
        this.close();
    }

    set(newClose: OptionalType<AutoCloseType>): void {
        if (newClose === this.reference.get()) {
            return;
        }
        const validNewClose = isPresent(newClose) ? typeToAutoClose(newClose) : newClose;
        try {
            this.close(); // close current value if present
        } finally {
            this.reference.set(validNewClose);
        }
    }

    static internalCreate(): RequiredType<AutoCloseOne> {
        return new AutoCloseOneImpl();
    }

    private constructor() {
        // empty
    }

    private readonly reference: AtomicReference<AutoClose> = createAtomicReference<AutoClose>();
}


