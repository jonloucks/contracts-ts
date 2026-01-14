import assert from "node:assert";

import { AUTO_CLOSE_NONE, AutoClose, inlineAutoClose, isAutoClose, isClose, unwrapAutoClose } from "contracts-ts/api/AutoClose";

import { AutoCloseFactory, CONTRACT as FACTORY, LAWYER as FACTORY_LAWYER } from "contracts-ts/api/AutoCloseFactory";
import { Contracts } from "contracts-ts/api/Contracts";
import { generateTestsForLawyer } from "contracts-ts/test/Lawyer.tools.test";
import { Tools } from "contracts-ts/test/Test.tools.test";
import { generatePredicateSuite, OPTIONAL_CASES, PredicateCase } from "contracts-ts/test/Types.tools.test";

const VALID_CASES: PredicateCase[] = [
  { value: { close: () => { }, [Symbol.dispose]: () => { } }, help: "an AutoClose value" },
];

const INVALID_CASES: PredicateCase[] = [
  { value: () => { }, help: "a simple function" },
  { value: Symbol("test"), help: "a symbol value" },
  // { value: function () { }, help: "a traditional function" }, 
  { value: async () => { }, help: "an async function" },
  { value: 42, help: "a number value" },
  { value: "abc", help: "a string value" },
  { value: {}, help: "an object value" }
]

generatePredicateSuite({
  name: 'isAutoClose',
  function: isAutoClose,
  validCases: [...VALID_CASES, ...OPTIONAL_CASES],
  invalidCases: INVALID_CASES
});

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

    assert.strictEqual(isAutoClose(autoClose), true, "inlineAutoClose should produce AutoClose.");

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
      [Symbol.dispose]: () => { }
    }), true, "object with close and dispose is AutoClose");
  });

  it('unwrapAutoClose works', () => {
    const closeFunction = () => { };
    const wrapped = inlineAutoClose(closeFunction);
    const notWrapped = {
      close: closeFunction,
      [Symbol.dispose]: () => { }
    };

    assert.strictEqual(unwrapAutoClose(null), null, "unwrap null is null");
    assert.strictEqual(unwrapAutoClose(undefined), undefined, "unwrap undefined is undefined");
    assert.strictEqual(unwrapAutoClose(wrapped), closeFunction, "unwrap inlineAutoClose returns original function");
    assert.strictEqual(unwrapAutoClose(notWrapped), notWrapped, "unwrap non-wrapped returns same instance");
  });
});

describe('AutoCloseFactory tests', () => {
  it('AutoCloseFactory.CONTRACT is bound and delivers', () => {
    Tools.withContracts((contracts: Contracts) => {
      assert.strictEqual(contracts.isBound(FACTORY), true);
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      assert.notStrictEqual(autoCloseFactory, null);
    });
  });
});

describe('createAutoClose', () => {
  it('with null throws', () => {
    Tools.withContracts((contracts: Contracts) => {
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      assert.throws(() => {
        autoCloseFactory.createAutoClose(null as unknown as AutoClose);
      }, {
        name: 'IllegalArgumentException',
        message: "AutoClose type must be present."
      });
    });
  });
  it('with valid AutoClose returns same instance', () => {
    const closeMock: AutoClose = jest.mocked<AutoClose>({
      close: jest.fn(),
      [Symbol.dispose]: jest.fn()
    });
    Tools.withContracts((contracts: Contracts) => {
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      const autoClose: AutoClose = autoCloseFactory.createAutoClose(closeMock);
      assert.strictEqual(autoClose, closeMock);
    });
  });
  it('with close-only instance returns AutoClose wrapping close', () => {
    const closeMock: AutoClose = jest.mocked<AutoClose>({
      close: jest.fn(),
      [Symbol.dispose]: jest.fn()
    });
    Tools.withContracts((contracts: Contracts) => {
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      const autoClose: AutoClose = autoCloseFactory.createAutoClose({
        close: () => closeMock.close()
      });
      assert.notStrictEqual(autoClose, null);
      assert.notStrictEqual(autoClose, closeMock);

      autoClose.close();
      expect(closeMock.close).toHaveBeenCalledTimes(1);

      autoClose[Symbol.dispose]();
      expect(closeMock.close).toHaveBeenCalledTimes(2);
    });
  });
  it('with function returns AutoClose wrapping function', () => {
    const closeMock: AutoClose = jest.mocked<AutoClose>({
      close: jest.fn(),
      [Symbol.dispose]: jest.fn()
    });
    const closeFunction = () => closeMock.close();

    Tools.withContracts((contracts: Contracts) => {
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      const autoClose: AutoClose = autoCloseFactory.createAutoClose(closeFunction);
      assert.notStrictEqual(autoClose, null);
      assert.notStrictEqual(autoClose, closeMock);

      autoClose.close();
      expect(closeMock.close).toHaveBeenCalledTimes(1);

      autoClose[Symbol.dispose]();
      expect(closeMock.close).toHaveBeenCalledTimes(2);
    });
  });
  it('with non-closeable throws', () => {
    Tools.withContracts((contracts: Contracts) => {
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      assert.throws(() => {
        autoCloseFactory.createAutoClose({} as unknown as AutoClose);
      }, {
        name: 'IllegalArgumentException',
        message: "Invalid AutoClose type."
      });
    });
  });
});

describe('AutoCloseOne tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('AutoCloseOne set with null does not throw', () => {
    Tools.withContracts((contracts: Contracts) => {
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      using autoCloseOne = autoCloseFactory.createAutoCloseOne();

      assert.doesNotThrow(() => {
        autoCloseOne.set(null);
      });
    });
  });

  it('AutoCloseOne closes current value once', () => {
    Tools.withContracts((contracts: Contracts) => {
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      const closeMock: AutoClose = jest.mocked<AutoClose>({
        close: jest.fn(),
        [Symbol.dispose]: jest.fn()
      });

      assert.strictEqual(isClose(closeMock), true);
      assert.strictEqual(isAutoClose(closeMock), true);

      {
        using autoCloseOne = autoCloseFactory.createAutoCloseOne();
        autoCloseOne.set(closeMock);
      }

      expect(closeMock.close).toHaveBeenCalledTimes(1);
      expect(closeMock[Symbol.dispose]).toHaveBeenCalledTimes(0);
    });
  });

  it('AutoCloseOne set to same value does not close immediately', () => {
    Tools.withContracts((contracts: Contracts) => {
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      const closeMock: AutoClose = jest.mocked<AutoClose>({
        close: jest.fn(),
        [Symbol.dispose]: jest.fn()
      });
      {
        using autoCloseOne = autoCloseFactory.createAutoCloseOne();
        autoCloseOne.set(closeMock);
        autoCloseOne.set(closeMock);
        expect(closeMock.close).toHaveBeenCalledTimes(0);
      }
      expect(closeMock.close).toHaveBeenCalledTimes(1);
    });
  });

  it('AutoCloseOne idempotent', () => {
    Tools.withContracts((contracts: Contracts) => {
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      const closeMock: AutoClose = jest.mocked<AutoClose>({
        close: jest.fn(),
        [Symbol.dispose]: jest.fn()
      });
      {
        using autoCloseOne = autoCloseFactory.createAutoCloseOne();
        autoCloseOne.set(closeMock);
        Tools.assertIdempotent(autoCloseOne);
      }
      expect(closeMock.close).toHaveBeenCalledTimes(1);
    });
  });

  it('AutoCloseOne set to new value closes old value immediately', () => {
    Tools.withContracts((contracts: Contracts) => {
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      const oldCloseMock: AutoClose = jest.mocked<AutoClose>({
        close: jest.fn(),
        [Symbol.dispose]: jest.fn()
      });

      const newCloseMock: AutoClose = jest.mocked<AutoClose>({
        close: jest.fn(),
        [Symbol.dispose]: jest.fn()
      });

      {
        using autoCloseOne = autoCloseFactory.createAutoCloseOne();
        autoCloseOne.set(oldCloseMock);
        autoCloseOne.set(newCloseMock);
        expect(newCloseMock.close).toHaveBeenCalledTimes(0);
        expect(oldCloseMock.close).toHaveBeenCalledTimes(1);
      }
      expect(newCloseMock.close).toHaveBeenCalledTimes(1);
      expect(oldCloseMock.close).toHaveBeenCalledTimes(1);
    });
  });
});

describe('AutoCloseMany tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('AutoCloseMany.add with null throws IllegalArgumentException', () => {
    Tools.withContracts((contracts: Contracts) => {
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      using autoCloseMany = autoCloseFactory.createAutoCloseMany();

      assert.throws(() => {
        autoCloseMany.add(null as unknown as AutoClose);
      }, {
        name: 'IllegalArgumentException',
        message: "AutoClose type must be present."
      });
    });
  });
  it('AutoCloseMany.add one item closes item', () => {
    const closeMock: AutoClose = jest.mocked<AutoClose>({
      close: jest.fn(),
      [Symbol.dispose]: jest.fn()
    });
    Tools.withContracts((contracts: Contracts) => {
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      {
        using autoCloseMany = autoCloseFactory.createAutoCloseMany();
        autoCloseMany.add(closeMock);
        expect(closeMock.close).toHaveBeenCalledTimes(0);
      }
      expect(closeMock.close).toHaveBeenCalledTimes(1);

    });
  });

  it('AutoCloseMany closes in reverse order', () => {
    const callOrder: number[] = [];
    const mockList: AutoClose[] = [];

    for (let i = 0; i < 5; i++) {
      mockList.push(jest.mocked<AutoClose>({
        close: () => { callOrder.push(i); },
        [Symbol.dispose]: () => { }
      }));
    }

    Tools.withContracts((contracts: Contracts) => {
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      {
        using autoCloseMany = autoCloseFactory.createAutoCloseMany();
        for (const mock of mockList) {
          autoCloseMany.add(mock);
        }
      }
      expect(callOrder).toEqual([4, 3, 2, 1, 0]);
    });
  });

  it('AutoCloseMany continues closing on error', () => {
    const callOrder: number[] = [];
    const mockList: AutoClose[] = [];

    for (let i = 0; i < 5; i++) {
      if (i === 2) {
        mockList.push(jest.mocked<AutoClose>({
          close: () => { throw new Error("Close error"); },
          [Symbol.dispose]: () => { }
        }));
      } else {
        mockList.push(jest.mocked<AutoClose>({
          close: () => { callOrder.push(i); },
          [Symbol.dispose]: () => { }
        }));
      }
    }

    Tools.withContracts((contracts: Contracts) => {
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      assert.throws(() => {
        {
          using autoCloseMany = autoCloseFactory.createAutoCloseMany();
          for (const mock of mockList) {
            autoCloseMany.add(mock);
          }
        }
      }, {
        name: 'Error',
        message: "Close error"
      });
      expect(callOrder).toEqual([4, 3, 1, 0]);
    });
  });
});

generateTestsForLawyer(FACTORY_LAWYER);
