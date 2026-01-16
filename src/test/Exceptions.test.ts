import { throws } from "node:assert";

import { ClassCastException } from "contracts-ts/api/auxiliary/ClassCastException";
import { IllegalArgumentException } from "contracts-ts/api/auxiliary/IllegalArgumentException";
import { IllegalStateException } from "contracts-ts/api/auxiliary/IllegalStateException";
import { ContractException } from "contracts-ts/api/ContractException";

describe('ContractException Tests', () => {
  it('without message throws IllegalArgumentException', () => {
    throws(() => {
      new ContractException(null as unknown as string);
    }, {
      // name: 'IllegalArgumentException',
      message: 'Message must be present.'
    });
  });

  it('with message, has correct name and message', () => {
    throws(() => {
      throw new ContractException("Problem.");
    }, {
      name: 'ContractException',
      message: "Problem."
    });
  });


  it('rethrow with Error caught with message, has correct name and message', () => {
    throws(() => {
      ContractException.rethrow(new Error("Inner problem."), "Outer Problem.");
    }, {
      name: 'ContractException',
      message: "Outer Problem."
    });
  });

  it('rethrow with Error caught without message, has correct name and message', () => {
    throws(() => {
      ContractException.rethrow(new Error("Inner problem."));
    }, {
      name: 'ContractException',
      message: "Inner problem."
    });
  });

  it('rethrow with null caught without message, has correct name and message', () => {
    throws(() => {
      ContractException.rethrow(null);
    }, {
      name: 'ContractException',
      message: "Unknown type of caught value."
    });
  });

  it('rethrow with null caught with message, has correct name and message', () => {
    throws(() => {
      ContractException.rethrow(null, "Outer Problem.");
    }, {
      name: 'ContractException',
      message: "Outer Problem."
    });
  });


  it('rethrow with ContractException caught with message, has correct name and message', () => {
    throws(() => {
      ContractException.rethrow(new ContractException("Inner Problem."), "Outer Problem.");
    }, {
      name: 'ContractException',
      message: "Inner Problem."
    });
  });
});

describe('IllegalStateException Tests', () => {
  it('without message throws IllegalArgumentException', () => {
    throws(() => {
      new IllegalStateException(null as unknown as string);
    }, {
      name: 'IllegalArgumentException',
      message: 'Message must be present.'
    });
  });
  it('with message has correct name and message', () => {
    throws(() => {
      throw new IllegalStateException("Problem.");
    }, {
      name: 'IllegalStateException',
      message: "Problem."
    });
  });
});

describe('IllegalArgumentException Tests', () => {
  it('without message throws IllegalArgumentException', () => {
    throws(() => {
      new IllegalArgumentException(null as unknown as string);
    }, {
      name: 'IllegalArgumentException',
      message: 'Message must be present.'
    });
  });
  it('with message has correct name and message', () => {
    throws(() => {
      throw new IllegalArgumentException("Problem.");
    }, {
      name: 'IllegalArgumentException',
      message: "Problem."
    });
  });
});

describe('ClassCastException Tests', () => {
  it('without message throws IllegalArgumentException', () => {
    throws(() => {
      new ClassCastException(null as unknown as string);
    }, {
      name: 'IllegalArgumentException',
      message: 'Message must be present.'
    });
  });
  it('with message has correct name and message', () => {
    throws(() => {
      throw new ClassCastException("Problem.");
    }, {
      name: 'ClassCastException',
      message: "Problem."
    });
  });
});

