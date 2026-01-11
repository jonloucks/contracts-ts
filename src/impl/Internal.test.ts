import assert from "assert";
import { Internal } from "./Internal.impl";

/**
 * Internal tests for internal Helpers functionality.
 */
describe("Internal mapForEachReversed", () => {

    it("with null map throws", () => {
        assert.throws(() => {
            Internal.mapForEachReversed(null as unknown as Map<unknown, unknown>, (key, value) => {
            })
        }, {
            name: 'IllegalArgumentException',
            message: 'Map must be present.'
        })
    });

    it("with empty map does not call callback", () => {
        let callCount = 0;
        const testMap = new Map<string, number>();
        Internal.mapForEachReversed(testMap, (key, value) => {
            callCount++;
        });
        assert.strictEqual(callCount, 0);
    });

    it("with multiple entries calls callback in reverse order", () => {
        const testMap = new Map<string, number>();
        testMap.set("one", 1);
        testMap.set("two", 2);
        testMap.set("three", 3);

        const keys: string[] = [];
        const values: number[] = [];

        Internal.mapForEachReversed(testMap, (key, value) => {
            keys.push(key);
            values.push(value);
        });

        assert.deepStrictEqual(keys, ["three", "two", "one"]);
        assert.deepStrictEqual(values, [3, 2, 1]);
    });
});