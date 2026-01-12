import { RequiredType} from "../api/Types";
import { AutoClose, AutoCloseOne, AutoCloseMany, AutoCloseType, typeToAutoClose } from "../api/AutoClose";
import { AutoCloseFactory } from "../api/AutoCloseFactory";
import { create as createAutoCloseMany } from "./AutoCloseMany.impl";
import { create as createAutoCloseOne } from "./AutoCloseOne.impl";

export { RequiredType } from "../api/Types";
export { AutoClose, AutoCloseType, AutoCloseOne, AutoCloseMany } from "../api/AutoClose";
export { AutoCloseFactory } from "../api/AutoCloseFactory";

/**
 * Create an AutoCloseFactory instance.
 *
 * @returns the AutoCloseFactory implementation
 */
export function create() : RequiredType<AutoCloseFactory> {
    return AutoCloseFactoryImpl.internalCreate();
}

// ---- Implementation details below ----

class AutoCloseFactoryImpl implements AutoCloseFactory {

    createAutoClose(type: RequiredType<AutoCloseType>): RequiredType<AutoClose> {
        return typeToAutoClose(type);
    }

    createAutoCloseMany(): RequiredType<AutoCloseMany> {
        return createAutoCloseMany()
    }

    createAutoCloseOne(): RequiredType<AutoCloseOne> {
        return createAutoCloseOne();
    }

    static internalCreate(): RequiredType<AutoCloseFactory> {
        return new AutoCloseFactoryImpl();
    }

    private constructor() {
    }
}
