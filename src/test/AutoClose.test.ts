import assert from 'node:assert';

import { AutoClose, isAutoClose, inlineAutoClose, AUTO_CLOSE_NONE } from "../api/AutoClose"

describe('AutoClose tests', () => {
    it('AUTO_CLOSE_NONE works', () => {
        assert.doesNotThrow(() => {
            AUTO_CLOSE_NONE.close();
            AUTO_CLOSE_NONE[Symbol.dispose]();
        });
    });

    it('inlineAutoClose works', () => {
        let closed = false;
        const autoClose: AutoClose = inlineAutoClose(() => {
            closed = true;
        });

        assert.strictEqual(closed, false, "should not be closed yet.");

        autoClose.close();
        assert.strictEqual(closed, true, "should be closed after close().");

        closed = false;
        autoClose[Symbol.dispose]();
        assert.strictEqual(closed, true, "should be closed after dispose().");
    });

    it('isAutoClose works', () => {
        assert.strictEqual(isAutoClose(null), true, "null is AutoClose");
        assert.strictEqual(isAutoClose(undefined), true, "undefined is AutoClose");
        assert.strictEqual(isAutoClose({}), false, "empty object is not AutoClose");
        assert.strictEqual(isAutoClose({
            close: () => { },
            "[Symbol.dispose]": () => { }
        }), true, "object with close and dispose is AutoClose");                  
    });
});

