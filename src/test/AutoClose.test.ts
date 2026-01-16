import { strictEqual, notStrictEqual, throws, doesNotThrow } from "node:assert";

import { AUTO_CLOSE_NONE, AutoClose, inlineAutoClose, isAutoClose, isClose, unwrapAutoClose } from "contracts-ts/api/AutoClose";
import { AutoCloseFactory, CONTRACT as FACTORY, LAWYER as FACTORY_LAWYER } from "contracts-ts/api/AutoCloseFactory";
import { Contracts } from "contracts-ts/api/Contracts";
import { generateTestsForLawyer } from "contracts-ts/test/Lawyer.tools.test";
import { Tools } from "contracts-ts/test/Test.tools.test";
import { generatePredicateSuite, OPTIONAL_CASES, PredicateCase } from "contracts-ts/test/Types.tools.test";

const VALID_CASES: PredicateCase[] = [
  {
    value: {
      close: (): void => { },
      [Symbol.dispose]: (): void => { }
    }, help: "an AutoClose value"
  },
];

const INVALID_CASES: PredicateCase[] = [
  { value: () : void => { }, help: "a simple function" },
  { value: Symbol("test"), help: "a symbol value" },
  { value: async (): Promise<void> => { }, help: "an async function" },
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
    doesNotThrow(() => {
      AUTO_CLOSE_NONE.close();
      AUTO_CLOSE_NONE[Symbol.dispose]();
    });
  });

  it('inlineAutoClose works', () => {
    let closed = false;
    const autoClose: AutoClose = inlineAutoClose(() => {
      closed = true;
    });

    strictEqual(isAutoClose(autoClose), true, "inlineAutoClose should produce AutoClose.");
    strictEqual(closed, false, "should not be closed yet.");
    autoClose.close();
    strictEqual(closed, true, "should be closed after close().");
    closed = false;
    autoClose[Symbol.dispose]();
    strictEqual(closed, true, "should be closed after dispose().");
  });

  it('isAutoClose works', () => {
    strictEqual(isAutoClose(null), true, "null is AutoClose");
    strictEqual(isAutoClose(undefined), true, "undefined is AutoClose");
    strictEqual(isAutoClose({}), false, "empty object is not AutoClose");
    strictEqual(isAutoClose({
      close: (): void => { },
      [Symbol.dispose]: (): void => { }
    }), true, "object with close and dispose is AutoClose");
  });

  it('unwrapAutoClose works', () => {
    const closeFunction = (): void => { };
    const wrapped = inlineAutoClose(closeFunction);
    const notWrapped = {
      close: closeFunction,
      [Symbol.dispose]: (): void => { }
    };

    strictEqual(unwrapAutoClose(null), null, "unwrap null is null");
    strictEqual(unwrapAutoClose(undefined), undefined, "unwrap undefined is undefined");
    strictEqual(unwrapAutoClose(wrapped), closeFunction, "unwrap inlineAutoClose returns original function");
    strictEqual(unwrapAutoClose(notWrapped), notWrapped, "unwrap non-wrapped returns same instance");
  });
});

describe('AutoCloseFactory tests', () => {
  it('AutoCloseFactory.CONTRACT is bound and delivers', () => {
    Tools.withContracts((contracts: Contracts) => {
      strictEqual(contracts.isBound(FACTORY), true, "AutoCloseFactory.CONTRACT is bound");
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      notStrictEqual(autoCloseFactory, null, "AutoCloseFactory is not null");
    });
  });
});

describe('createAutoClose', () => {
  it('with null throws', () => {
    Tools.withContracts((contracts: Contracts) => {
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      throws(() => {
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
      strictEqual(autoClose, closeMock, "with valid AutoClose returns same instance");
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
        close: () : void => closeMock.close()
      });
      notStrictEqual(autoClose, null, "with close-only instance returns AutoClose wrapping close");
      notStrictEqual(autoClose, closeMock, "with close-only instance returns AutoClose wrapping close");

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
    const closeFunction = () : void => closeMock.close();

    Tools.withContracts((contracts: Contracts) => {
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      const autoClose: AutoClose = autoCloseFactory.createAutoClose(closeFunction);
      notStrictEqual(autoClose, null, "with function returns AutoClose wrapping function");
      notStrictEqual(autoClose, closeMock, "with function returns AutoClose wrapping function");

      autoClose.close();
      expect(closeMock.close).toHaveBeenCalledTimes(1);

      autoClose[Symbol.dispose]();
      expect(closeMock.close).toHaveBeenCalledTimes(2);
    });
  });
  it('with non-closeable throws', () => {
    Tools.withContracts((contracts: Contracts) => {
      const autoCloseFactory: AutoCloseFactory = contracts.enforce(FACTORY);
      throws(() => {
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

      doesNotThrow(() => {
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

      strictEqual(isClose(closeMock), true, "isClose should be true");
      strictEqual(isAutoClose(closeMock), true, "isAutoClose should be true");

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

      throws(() => {
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
      throws(() => {
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
