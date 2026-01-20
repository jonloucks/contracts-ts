import { throws } from "node:assert";

import { create as createEvents, Events, Config as EventsConfig } from "./Events.impl";

describe("Events", () => {

  test("with null config should throw error", () => {
    throws(() => {
      createEvents(null as unknown as EventsConfig);
    }, {
      name: 'IllegalArgumentException',
      message: "Config must be present."
    });
  });

  test("with no callback present should throw error", () => {
    throws(() => {
      createEvents({} as EventsConfig);
    }, {
      name: 'IllegalArgumentException',
      message: "Callback must be present."
    });
  });

  test("should open and close event listeners", () => {
    let callbackInvoked = false;
    const eventName = "test-event";

    const events: Events = createEvents({
      names: [eventName],
      callback: () => {
        callbackInvoked = true;
      }
    });

    expect(events.isOpen()).toBe(false);

    const autoClose = events.open();
    expect(events.isOpen()).toBe(true);

    process.emit(eventName);
    expect(callbackInvoked).toBe(true);

    callbackInvoked = false; // reset for next test

    autoClose.close();
    expect(events.isOpen()).toBe(false);

    process.emit(eventName);
    expect(callbackInvoked).toBe(false); // should not be invoked after close
  });

  test("should handle multiple open calls idempotently", () => {
    let callbackCount = 0;
    const eventName = "test-event-multiple";

    const events: Events = createEvents({
      names: [eventName],
      callback: () => {
        callbackCount++;
      }
    });

    const autoClose1 = events.open();
    const autoClose2 = events.open(); // should be no-op

    expect(events.isOpen()).toBe(true);

    process.emit(eventName);
    expect(callbackCount).toBe(1);

    autoClose1.close();
    expect(events.isOpen()).toBe(false);

    process.emit(eventName);
    expect(callbackCount).toBe(1); // should not increment after close

    autoClose2.close(); // should be no-op
  });

  test("should handle close without open gracefully", () => {
    const events: Events = createEvents({
      names: ["non-existent-event"],
      callback: () => { }
    });

    expect(events.isOpen()).toBe(false);

    // Closing without opening should be a no-op
    const autoClose = events.open();
    autoClose.close();
    autoClose.close(); // second close should be no-op

    expect(events.isOpen()).toBe(false);
  });


  it('raised events should invoke the callback', () => {
    let invoked = false;
    const eventName = 'test-callback-invocation';

    const events: Events = createEvents({
      names: [eventName],
      callback: () => {
        invoked = true;
      }
    });

    const autoClose = events.open();
    process.emit(eventName);
    expect(invoked).toBe(true);
    expect(events.isOpen()).toBe(true);

    autoClose.close();
    expect(events.isOpen()).toBe(false);
  });
});
