# contracts-ts

TypeScript Dependency Contracts for dependency inversion

## Overview

`contracts-ts` is a lightweight dependency injection library for TypeScript that enables clean dependency inversion and inversion of control (IoC) patterns in your applications.

## Features

- 🎯 **Type-safe**: Full TypeScript support with generics
- 🪶 **Lightweight**: Zero dependencies, minimal footprint
- 🔧 **Flexible**: Supports transient, singleton, and constant bindings
- 🎨 **Multiple contract types**: Use symbols, strings, or class constructors as contracts
- 📦 **Simple API**: Easy to learn and use

## Installation

```bash
npm install @jonloucks/contracts-ts
```

## Quick Start

```typescript
import { createContainer } from '@jonloucks/contracts-ts';

// Define a contract (unique identifier)
const LoggerContract = Symbol('Logger');

// Create a container
const container = createContainer();

// Bind the contract to an implementation
container.singleton(LoggerContract, () => ({
  log: (message: string) => console.log(message),
}));

// Resolve the dependency
const logger = container.resolve(LoggerContract);
logger.log('Hello, World!');
```

## API Reference

### `createContainer()`

Creates a new dependency injection container.

```typescript
const container = createContainer();
```

### `container.bind<T>(contract, factory)`

Binds a contract to a factory function. The factory is called each time the dependency is resolved (transient lifetime).

```typescript
container.bind(MyServiceContract, () => new MyService());
```

### `container.singleton<T>(contract, factory)`

Binds a contract to a singleton. The factory is called once and the result is cached.

```typescript
container.singleton(LoggerContract, () => new Logger());
```

### `container.constant<T>(contract, value)`

Binds a contract to a constant value.

```typescript
container.constant(ConfigContract, { apiUrl: 'https://api.example.com' });
```

### `container.resolve<T>(contract)`

Resolves a dependency by its contract.

```typescript
const service = container.resolve(MyServiceContract);
```

### `container.has(contract)`

Checks if a contract is bound.

```typescript
if (container.has(MyServiceContract)) {
  // ...
}
```

### `container.clear()`

Clears all bindings and cached singletons.

```typescript
container.clear();
```

## Examples

### Basic Dependency Injection

```typescript
import { createContainer } from '@jonloucks/contracts-ts';

interface Logger {
  log(message: string): void;
}

const LoggerContract = Symbol('Logger');
const container = createContainer();

container.singleton<Logger>(LoggerContract, () => ({
  log: (message) => console.log(`[LOG] ${message}`),
}));

const logger = container.resolve<Logger>(LoggerContract);
logger.log('Application started');
```

### Dependency Chains

```typescript
const LoggerContract = Symbol('Logger');
const DatabaseContract = Symbol('Database');
const UserServiceContract = Symbol('UserService');

container.singleton(LoggerContract, () => new Logger());
container.singleton(DatabaseContract, (c) => new Database(c.resolve(LoggerContract)));
container.bind(UserServiceContract, (c) => 
  new UserService(
    c.resolve(DatabaseContract),
    c.resolve(LoggerContract)
  )
);

const userService = container.resolve(UserServiceContract);
```

### Using Class Contracts

```typescript
class Logger {
  log(message: string) {
    console.log(message);
  }
}

container.singleton(Logger, () => new Logger());
const logger = container.resolve(Logger);
```

### String Contracts

```typescript
container.bind('logger', () => new Logger());
const logger = container.resolve('logger');
```

## Benefits of Dependency Injection

- **Testability**: Easily mock dependencies in tests
- **Flexibility**: Swap implementations without changing code
- **Maintainability**: Clear separation of concerns
- **Loose Coupling**: Components depend on contracts, not concrete implementations

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

