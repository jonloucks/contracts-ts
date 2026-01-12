import { AutoClose, AutoCloseType, typeToAutoClose, AutoCloseMany } from "../api/AutoClose";
import { RequiredType } from "../api/Types";

export { RequiredType } from "../api/Types";
export { AutoCloseMany } from "../api/AutoClose";

/**
 * Create an AutoCloseMany instance.
 *
 * @returns the AutoCloseMany implementation
 */
export function create(): RequiredType<AutoCloseMany> {
    return AutoCloseManyImpl.internalCreate();
}

// ---- Implementation details below ----

/**
 * AutoCloseMany implementation.
 */
class AutoCloseManyImpl implements AutoCloseMany {

    add(closeable: RequiredType<AutoCloseType>): void {
        this.closeables.push(typeToAutoClose(closeable));
    }

    close(): void {
        const errorList: unknown[] = [];
        while (this.closeables.length > 0) {
            try {
                this.closeables.pop()?.close();
            } catch (error) {
                errorList.push(error);
            }
        }
        if (errorList.length === 1) {
            throw errorList[0];
        } else if (errorList.length > 1) {
            throw new AggregateError(errorList, "Multiple errors occurred while closing AutoCloseMany resources");
        }
    }

    [Symbol.dispose](): void {
        this.close();
    }

    static internalCreate(): RequiredType<AutoCloseMany> {
        return new AutoCloseManyImpl();
    }

    private constructor() {
    }


    private closeables: RequiredType<AutoClose>[] = [];
};