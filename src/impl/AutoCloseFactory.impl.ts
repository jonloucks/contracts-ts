import { AutoClose, AutoCloseMany, AutoCloseOne, AutoCloseType, typeToAutoClose } from "contracts-ts/api/AutoClose";
import { AutoCloseFactory } from "contracts-ts/api/AutoCloseFactory";
import { RequiredType } from "contracts-ts/api/Types";
import { create as createAutoCloseMany } from "contracts-ts/impl/AutoCloseMany.impl";
import { create as createAutoCloseOne } from "contracts-ts/impl/AutoCloseOne.impl";

export { AutoClose, AutoCloseMany, AutoCloseOne, AutoCloseType } from "contracts-ts/api/AutoClose";
export { AutoCloseFactory } from "contracts-ts/api/AutoCloseFactory";
export { RequiredType } from "contracts-ts/api/Types";

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
