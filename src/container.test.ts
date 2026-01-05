import { createContract } from './contract';
import { Container } from './container';

describe('Container', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it('should bind and resolve a contract', () => {
    const contract = createContract<string>('StringContract');
    const implementation = 'test implementation';

    container.bind(contract, implementation);
    const resolved = container.resolve(contract);

    expect(resolved).toBe(implementation);
  });

  it('should throw an error when resolving an unbound contract', () => {
    const contract = createContract<string>('UnboundContract');

    expect(() => container.resolve(contract)).toThrow();
  });

  it('should check if a contract is bound', () => {
    const contract = createContract<string>('TestContract');

    expect(container.has(contract)).toBe(false);

    container.bind(contract, 'implementation');

    expect(container.has(contract)).toBe(true);
  });

  it('should clear all bindings', () => {
    const contract1 = createContract<string>('Contract1');
    const contract2 = createContract<number>('Contract2');

    container.bind(contract1, 'test');
    container.bind(contract2, 42);

    expect(container.has(contract1)).toBe(true);
    expect(container.has(contract2)).toBe(true);

    container.clear();

    expect(container.has(contract1)).toBe(false);
    expect(container.has(contract2)).toBe(false);
  });

  it('should handle object implementations', () => {
    interface TestService {
      getMessage(): string;
    }

    const contract = createContract<TestService>('ServiceContract');
    const implementation: TestService = {
      getMessage: () => 'Hello, World!'
    };

    container.bind(contract, implementation);
    const resolved = container.resolve(contract);

    expect(resolved.getMessage()).toBe('Hello, World!');
  });
});
