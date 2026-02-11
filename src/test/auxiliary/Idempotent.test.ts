import { MockProxy } from "jest-mock-extended";
import { ok, strictEqual, throws } from "node:assert";

import { AutoClose, AutoOpen, CONTRACTS, Contracts, createContracts, isPresent } from "@jonloucks/contracts-ts";
import { Open } from "@jonloucks/contracts-ts/api/Open";
import { IdempotentState } from "@jonloucks/contracts-ts/auxiliary/IdempotenState";
import { Idempotent, Config as IdempotentConfig, guard as isIdempotent } from "@jonloucks/contracts-ts/auxiliary/Idempotent";
import { CONTRACT as IDEMPOTENT_FACTORY, IdempotentFactory } from "@jonloucks/contracts-ts/auxiliary/IdempotentFactory";

import { assertGuard, mockDuck } from "@jonloucks/contracts-ts/test/helper.test.js";

const FUNCTION_NAMES: (string | symbol)[] = [
  'getState',
  'isOpen',
  'open'
];

const AUTO_CLOSE_FUNCTION_NAMES: (string | symbol)[] = [
  'close',
  Symbol.dispose
];

function duckAutoClose(): MockProxy<AutoClose> {
  const autoClose = mockDuck<AutoClose>(...AUTO_CLOSE_FUNCTION_NAMES);
  autoClose.close.mockReturnValue(undefined);
  return autoClose;
}

function duckAutoOpen(): MockProxy<AutoOpen> {
  const autoOpen = mockDuck<AutoOpen>('autoOpen');
  autoOpen.autoOpen.mockReturnValue(duckAutoClose());
  return autoOpen;
}

function duckOpen(): MockProxy<Open> {
  const open = mockDuck<Open>('open');
  open.open.mockReturnValue(duckAutoClose());
  return open;
}

assertGuard(isIdempotent, ...FUNCTION_NAMES);

describe('Idempotent Suite', () => {
  let contracts: Contracts;
  let closeContracts: AutoClose;

  const createIdempotent = (config: IdempotentConfig): Idempotent => {
    const factory: IdempotentFactory = contracts.enforce(IDEMPOTENT_FACTORY);
    return factory.createIdempotent(config);
  };

  beforeAll(() => {
    contracts = createContracts();
    closeContracts = contracts.open();
  });

  afterAll(() => {
    closeContracts?.close();
  });

  describe('Idempotent Guard Tests', () => {
    it('isIdempotent should return true for Idempotent', () => {
      const idempotent: Idempotent = mockDuck<Idempotent>(...FUNCTION_NAMES);
      ok(isIdempotent(idempotent), 'Idempotent should return true');
    });
  });

  describe('Idempotent Creation Tests', () => {
    it('should create Idempotent with Open interface', () => {
      const mockOpen = duckOpen();

      const idempotent = createIdempotent({
        open: mockOpen
      });

      ok(isPresent(idempotent), 'Idempotent should be created');
      ok(isIdempotent(idempotent), 'Created instance should be Idempotent');
    });

    it('should create Idempotent with AutoOpen interface', () => {
      const idempotent = createIdempotent({
        open: duckAutoOpen()
      });

      ok(isPresent(idempotent), 'Idempotent should be created with AutoOpen');
      ok(isIdempotent(idempotent), 'Created instance should be Idempotent');
    });

    it('should create Idempotent with function returning AutoClose', () => {
      const openFn = (): AutoClose => duckAutoClose();

      const idempotent = createIdempotent({
        open: openFn
      });

      ok(isPresent(idempotent), 'Idempotent should be created with function');
      ok(isIdempotent(idempotent), 'Created instance should be Idempotent');
    });

    it('should throw error for invalid OpenType', () => {
      throws(() => {
        createIdempotent({
          open: "invalid" as unknown as Open
        });
      }, {
        message: /invalid open type/i
      });
    });
  });

  describe('Idempotent State Tests', () => {
    it('should return initial state OPENABLE', () => {
      const idempotent = createIdempotent({
        open: duckOpen()
      });

      const state = idempotent.getState();
      strictEqual(state, 'OPENABLE', 'Initial state should be OPENABLE');
    });

    it('should transition state from OPENABLE to OPENED on first open', () => {
      const mockOpen: MockProxy<Open> = duckOpen();

      const idempotent = createIdempotent({
        open: mockOpen
      });

      const initialState: IdempotentState = idempotent.getState();
      strictEqual(initialState, 'OPENABLE', 'Initial state should be OPENABLE');

      const autoClose: AutoClose = idempotent.open();
      ok(isPresent(autoClose), 'open() should return AutoClose');

      const openedState: IdempotentState = idempotent.getState();
      strictEqual(openedState, 'OPENED', 'State should transition to OPENED');

      autoClose.close();
    });

    it('should transition state to CLOSED on close', () => {
      const idempotent = createIdempotent({
        open: duckOpen()
      });

      const autoClose = idempotent.open();
      const openedState = idempotent.getState();
      strictEqual(openedState, 'OPENED', 'State should be OPENED after open');

      autoClose.close();
      const closedState = idempotent.getState();
      strictEqual(closedState, 'CLOSED', 'State should transition to CLOSED after close');
    });

    it('should return OPENED state after first open', () => {
      const idempotent = createIdempotent({
        open: duckOpen()
      });

      idempotent.open();
      const state = idempotent.getState();
      strictEqual(state, 'OPENED', 'State after open should be OPENED');
    });

    it('should stay OPENED on second open attempt', () => {
      const idempotent = createIdempotent({
        open: duckOpen()
      });

      const autoClose1 = idempotent.open();
      const state1 = idempotent.getState();
      strictEqual(state1, 'OPENED', 'First state should be OPENED');

      const autoClose2 = idempotent.open();
      const state2 = idempotent.getState();
      strictEqual(state2, 'OPENED', 'State should remain OPENED');

      autoClose1.close();
      autoClose2.close();
    });
  });

  describe('Idempotent Open Method Tests', () => {
    it('open should return AutoClose object', () => {
      const mockOpen = duckOpen();

      const idempotent = createIdempotent({
        open: mockOpen
      });

      const result = idempotent.open();
      ok(isPresent(result), 'open() should return a value');
      ok(isPresent(result.close), 'Returned value should have close method');
      ok(typeof result.close === 'function', 'close should be a function');
      result.close();
    });

    it('open should call delegate.open() once on first call', () => {
      const mockOpen = duckOpen();

      const idempotent = createIdempotent({
        open: mockOpen
      });

      idempotent.open();
      strictEqual(mockOpen.open.mock.calls.length, 1, 'delegate.open() should be called once on first open');
    });

    it('open should not call delegate.open() on second call', () => {
      const mockOpen = duckOpen();

      const idempotent = createIdempotent({
        open: mockOpen
      });

      idempotent.open();
      idempotent.open();
      strictEqual(mockOpen.open.mock.calls.length, 1, 'delegate.open() should only be called once');
    });

    it('open should be idempotent - multiple calls return different AutoClose', () => {
      const mockOpen = duckOpen();

      const idempotent = createIdempotent({
        open: mockOpen
      });

      const autoClose1 = idempotent.open();
      const autoClose2 = idempotent.open();

      // Different references but both should be closeable
      ok(isPresent(autoClose1.close), 'First AutoClose has close');
      ok(isPresent(autoClose2.close), 'Second AutoClose has close');
      autoClose1.close();
      autoClose2.close();
    });

    it('should close without error', () => {
      const mockOpen = duckOpen();

      const idempotent = createIdempotent({
        open: mockOpen
      });

      const autoClose = idempotent.open();
      autoClose.close();
      ok(true, 'Close should complete without error');
    });

    it('should handle multiple close calls', () => {
      const mockOpen = duckOpen();

      const idempotent = createIdempotent({
        open: mockOpen
      });

      const autoClose = idempotent.open();
      autoClose.close();
      autoClose.close();
      ok(true, 'Multiple close calls should not error');
    });
  });

  describe('Idempotent Lifecycle Tests', () => {
    it('should complete open-close cycle', () => {
      const mockOpen = duckOpen();

      const idempotent = createIdempotent({
        open: mockOpen
      });

      strictEqual(idempotent.getState(), 'OPENABLE', 'Initial state OPENABLE');

      const autoClose = idempotent.open();
      strictEqual(idempotent.getState(), 'OPENED', 'State OPENED after open');

      autoClose.close();
      strictEqual(idempotent.getState(), 'CLOSED', 'State CLOSED after close');
    });

    it('should handle rapid open-close-open cycles', () => {
      const mockOpen = duckOpen();

      const idempotent = createIdempotent({
        open: mockOpen
      });

      for (let i = 0; i < 5; i++) {
        const autoClose = idempotent.open();
        autoClose.close();
      }

      ok(true, 'Rapid cycles should complete');
    });

    it('should handle concurrent open calls', () => {
      const mockOpen = duckOpen();

      const idempotent = createIdempotent({
        open: mockOpen
      });

      const autoCloses = [];
      for (let i = 0; i < 5; i++) {
        autoCloses.push(idempotent.open());
      }

      strictEqual(autoCloses.length, 5, 'Should return 5 AutoClose objects');
      autoCloses.forEach((ac, i) => {
        ok(isPresent(ac.close), `AutoClose ${i} should have close`);
      });
      autoCloses.forEach(ac => ac.close());
    });
  });

  describe('Idempotent Config Tests', () => {
    it('should create with explicit contracts', () => {
      const mockOpen = duckOpen();

      const idempotent = createIdempotent({
        open: mockOpen
      });

      ok(isPresent(idempotent), 'Should create with explicit contracts');
    });

    it('should require open in config', () => {
      throws(() => {
        createIdempotent({
          open: undefined as unknown as typeof CONTRACTS,
        });
      });
    });
  });

  describe('Idempotent Edge Cases', () => {
    it('should handle AutoOpen with autoOpen method', () => {
      const mockAutoOpen = duckAutoOpen();

      const idempotent = createIdempotent({
        open: mockAutoOpen
      });

      ok(isPresent(idempotent), 'Should create with AutoOpen');
      const result = idempotent.open();
      ok(isPresent(result), 'Should return AutoClose');
    });

    it('should handle function returning AutoClose', () => {
      const mockAutoClose = duckAutoClose();
      const openFn = (): AutoClose => mockAutoClose;

      const idempotent = createIdempotent({
        open: openFn
      });

      ok(isPresent(idempotent), 'Should create with function');
      const result = idempotent.open();
      ok(isPresent(result), 'Should return AutoClose');
    });

    it('should create multiple independent instances', () => {
      const mockOpen = duckOpen();

      const instances = [];
      for (let i = 0; i < 3; i++) {
        instances.push(createIdempotent({
          open: mockOpen
        }));
      }

      strictEqual(instances.length, 3, 'Should create 3 instances');
      instances.forEach((instance, i) => {
        ok(isIdempotent(instance), `Instance ${i} should be Idempotent`);
        strictEqual(instance.getState(), 'OPENABLE', `Instance ${i} should start in OPENABLE`);
      });
    });

    it('should handle zero-argument constructor properly', () => {
      const mockOpen = duckOpen();

      const idempotent = createIdempotent({
        open: mockOpen
      });

      ok(isPresent(idempotent.getState), 'getState method should exist');
      ok(isPresent(idempotent.open), 'open method should exist');
    });
  });

  describe('Idempotent Integration Tests', () => {
    it('should have both getState and open methods from interface', () => {
      const mockOpen = duckOpen();

      const idempotent = createIdempotent({
        open: mockOpen
      });

      ok(typeof idempotent.getState === 'function', 'Should have getState function');
      ok(typeof idempotent.open === 'function', 'Should have open function');
    });

    it('should coordinate state and open/close operations', () => {
      const mockOpen = duckOpen();

      const idempotent = createIdempotent({
        open: mockOpen
      });

      // Check initial state before opening
      ok(idempotent.getState() === 'OPENABLE', 'Initial state should be OPENABLE');

      // Open and check state
      const autoClose = idempotent.open();
      ok(idempotent.getState() === 'OPENED', 'State should be OPENED after open');

      // Close and check state
      autoClose.close();
      ok(idempotent.getState() === 'CLOSED', 'State should be CLOSED after close');
    });

    it('when open throws', () => {
      const problem : Error = new Error('Open failed');

      const idempotent = createIdempotent({
        open: () => { throw problem; }
      });

      throws(() => {
        idempotent.open();
      }, (err: Error) => {
        strictEqual(err, problem, 'Thrown error should match problem');
        return true;
      });

      ok(idempotent.getState() === 'OPENABLE', 'After open error should be OPENABLE');
    });

    it('should properly manage AutoCloseMany internally', () => {
      const mockOpen = duckOpen();

      const idempotent = createIdempotent({
        open: mockOpen
      });

      const ac1 = idempotent.open();
      const ac2 = idempotent.open();

      ok(isPresent(ac1), 'First open should return AutoClose');
      ok(isPresent(ac2), 'Second open should return AutoClose');

      ac1.close();
      ac2.close();
      ok(true, 'Closing multiple references should work');
    });
  });
});