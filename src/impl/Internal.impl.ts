import { presentCheck } from "../api/Checks";

/**
 * Helper functions for internal implementations.
 */
export const Internal = {

    /**
     * Iterate over a Map in reverse order, invoking the callback for each entry.
     * @param map the Map to iterate over
     * @param callback the callback to invoke for each entry
     */
    mapForEachReversed<K, V>(map: Map<K, V>, callback: (key: K, value: V) => void): void {
        const validMap = presentCheck(map, "Map must be present.");
        const entries: [K, V][] = [];
        validMap.forEach((value, key) => {
            entries.push([key, value]);
        });
        while (entries.length > 0) {
            const entry = entries.pop()!;
            callback(entry[0], entry[1]);
        }
    }
}