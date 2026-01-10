export class CloserImpl {
    constructor() {
    
    }

    close() : void {
        let autoClose = this.reference.get();
        if (autoClose !== null && autoClose !== undefined && this.reference.compareAndSet(autoClose, null)) {
            autoClose.close();
        }
    }

    set(autoClose: AutoClose) : void{
        if (autoClose === this.reference.get()) {
            return;
        }
        try {   
            this.close();
        } finally {
            this.reference.set(autoClose);
        }
    }
    
    private readonly reference: AtomicReference<AutoClose> = createAtomicReference<AutoClose>();
}

import { AtomicReference } from "../api/AtomicReference";
import { AutoClose } from "../api/AutoClose";
import { create as createAtomicReference } from "./AtomicReference.impl";

