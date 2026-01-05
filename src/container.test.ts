import { Container, createContainer } from './container';

describe('Container', () => {
  let container: Container;

  beforeEach(() => {
    container = createContainer();
  });

  describe('bind', () => {
    it('should bind and resolve a simple dependency', () => {
      const TestContract = Symbol('Test');
      container.bind(TestContract, () => ({ value: 'test' }));

      const result = container.resolve(TestContract);
      expect(result).toEqual({ value: 'test' });
    });

    it('should create new instances on each resolve', () => {
      const TestContract = Symbol('Test');
      container.bind(TestContract, () => ({ value: Math.random() }));

      const result1 = container.resolve(TestContract);
      const result2 = container.resolve(TestContract);

      expect(result1).not.toBe(result2);
    });

    it('should allow accessing container in factory', () => {
      const DependencyContract = Symbol('Dependency');
      const ServiceContract = Symbol('Service');

      container.bind(DependencyContract, () => ({ name: 'dependency' }));
      container.bind(ServiceContract, (c) => ({
        dependency: c.resolve(DependencyContract),
      }));

      const result = container.resolve(ServiceContract) as any;
      expect(result.dependency).toEqual({ name: 'dependency' });
    });

    it('should support string contracts', () => {
      container.bind('test', () => 'value');
      expect(container.resolve('test')).toBe('value');
    });

    it('should support class contracts', () => {
      class TestClass {
        value = 'test';
      }
      container.bind(TestClass, () => new TestClass());
      const result = container.resolve(TestClass);
      expect(result).toBeInstanceOf(TestClass);
      expect(result.value).toBe('test');
    });
  });

  describe('singleton', () => {
    it('should cache singleton instances', () => {
      const TestContract = Symbol('Test');
      container.singleton(TestContract, () => ({ value: Math.random() }));

      const result1 = container.resolve(TestContract) as any;
      const result2 = container.resolve(TestContract) as any;

      expect(result1).toBe(result2);
      expect(result1.value).toBe(result2.value);
    });

    it('should call factory only once for singletons', () => {
      const TestContract = Symbol('Test');
      const factory = jest.fn(() => ({ value: 'test' }));
      container.singleton(TestContract, factory);

      container.resolve(TestContract);
      container.resolve(TestContract);
      container.resolve(TestContract);

      expect(factory).toHaveBeenCalledTimes(1);
    });
  });

  describe('constant', () => {
    it('should bind a constant value', () => {
      const TestContract = Symbol('Test');
      const value = { constant: true };
      container.constant(TestContract, value);

      const result = container.resolve(TestContract);
      expect(result).toBe(value);
    });

    it('should not require a factory for constants', () => {
      const TestContract = Symbol('Test');
      container.constant(TestContract, 'constant-value');

      expect(container.resolve(TestContract)).toBe('constant-value');
    });
  });

  describe('has', () => {
    it('should return true for bound contracts', () => {
      const TestContract = Symbol('Test');
      container.bind(TestContract, () => 'value');

      expect(container.has(TestContract)).toBe(true);
    });

    it('should return true for singleton contracts', () => {
      const TestContract = Symbol('Test');
      container.singleton(TestContract, () => 'value');

      expect(container.has(TestContract)).toBe(true);
    });

    it('should return true for constant contracts', () => {
      const TestContract = Symbol('Test');
      container.constant(TestContract, 'value');

      expect(container.has(TestContract)).toBe(true);
    });

    it('should return false for unbound contracts', () => {
      const TestContract = Symbol('Test');
      expect(container.has(TestContract)).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all bindings', () => {
      const TestContract = Symbol('Test');
      container.bind(TestContract, () => 'value');

      container.clear();

      expect(container.has(TestContract)).toBe(false);
    });

    it('should clear singleton cache', () => {
      const TestContract = Symbol('Test');
      container.singleton(TestContract, () => ({ value: Math.random() }));

      const result1 = container.resolve(TestContract);
      container.clear();

      container.singleton(TestContract, () => ({ value: Math.random() }));
      const result2 = container.resolve(TestContract);

      expect(result1).not.toBe(result2);
    });
  });

  describe('error handling', () => {
    it('should throw error for unbound contract', () => {
      const TestContract = Symbol('Test');

      expect(() => container.resolve(TestContract)).toThrow(
        'No binding found for contract: Symbol(Test)'
      );
    });

    it('should throw error with string contract name', () => {
      expect(() => container.resolve('unknown')).toThrow('No binding found for contract: unknown');
    });
  });

  describe('complex scenarios', () => {
    it('should handle circular dependencies within same resolve', () => {
      const ServiceAContract = Symbol('ServiceA');
      const ServiceBContract = Symbol('ServiceB');

      container.bind(ServiceAContract, (c) => ({
        name: 'A',
        getB: () => c.resolve(ServiceBContract),
      }));

      container.bind(ServiceBContract, (c) => ({
        name: 'B',
        getA: () => c.resolve(ServiceAContract),
      }));

      const serviceA = container.resolve(ServiceAContract) as any;
      const serviceB = serviceA.getB();

      expect(serviceA.name).toBe('A');
      expect(serviceB.name).toBe('B');
    });

    it('should support dependency chains', () => {
      const LoggerContract = Symbol('Logger');
      const DatabaseContract = Symbol('Database');
      const UserServiceContract = Symbol('UserService');

      container.singleton(LoggerContract, () => ({ log: jest.fn() }));
      container.singleton(DatabaseContract, (c) => ({
        logger: c.resolve(LoggerContract),
        query: jest.fn(),
      }));
      container.bind(UserServiceContract, (c) => ({
        db: c.resolve(DatabaseContract),
        logger: c.resolve(LoggerContract),
      }));

      const userService = container.resolve(UserServiceContract) as any;
      expect(userService.db.logger).toBe(userService.logger);
    });
  });
});
