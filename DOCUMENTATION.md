# contracts-ts Documentation

This document is the primary written guide for using and contributing to `@jonloucks/contracts-ts`.

## Overview

`@jonloucks/contracts-ts` provides TypeScript contracts and promisor patterns to support dependency inversion, runtime validation, and controlled lifecycle management.

Key goals:
- Decouple service consumers from implementations
- Enforce type-safe and testable bindings at runtime
- Support singleton, lifecycle, and extractor promisor strategies

## Installation

```bash
npm install @jonloucks/contracts-ts
```

## Node.js Support

Supported Node.js versions for development and CI are:
- `20.x`
- `22.x`
- `24.x`

## Quick Start

### 1) Import core APIs

```typescript
import { createContract } from "@jonloucks/contracts-ts";
import { bind, createSingleton, enforce, guardFunctions } from "@jonloucks/contracts-ts/api/Convenience";
```

### 2) Define a contract

```typescript
interface Logger {
  log(message: string): void;
}

const LOGGER = createContract<Logger>({
  name: "Logger",
  test: (obj: unknown): obj is Logger => guardFunctions(obj, "log")
});
```

### 3) Bind and use

```typescript
bind(LOGGER, createSingleton(() => ({
  log: (message: string) => console.log(message)
})));

const logger = enforce(LOGGER);
logger.log("Hello contracts-ts");
```

## Import Paths (v2.0.0)

v2.0.0 intentionally narrows root exports.

### Root package (`@jonloucks/contracts-ts`)
Use for essential core exports:
- `CONTRACTS`
- `createContract`
- `createContracts`
- core contract types/config types
- `ContractException`
- `VERSION`

### Convenience packages
Use convenience modules for broader helpers:
- `@jonloucks/contracts-ts/api/Convenience`
- `@jonloucks/contracts-ts/auxiliary/Convenience`

### Explicit subpath imports
Use explicit modules for focused dependencies:
- `@jonloucks/contracts-ts/api/*`
- `@jonloucks/contracts-ts/auxiliary/*`

## Core Concepts

### Contract
Defines the shape and runtime validator for a dependency.

### Promisor
Provides the implementation deliverable for a contract.

### Binding
Associates a contract with a promisor using bind strategies.

### Enforce vs Claim
- `enforce(contract)` requires a present deliverable
- `claim(contract)` returns an optional deliverable

## Common Patterns

### Singleton
Use `createSingleton` for one shared implementation instance.

### Lifecycle
Use `createLifeCycle` when open/close behavior must be coordinated.

### Extractor
Use `createExtractor` to map a promisor deliverable into another value.

## Migration Notes for v2.0.0

### Breaking changes
- Root barrel exports were reduced (`index.ts` no longer exports broad helper surfaces)
- Deprecated APIs removed
- Package is ESM-first (`"type": "module"`)
- `@jonloucks/contracts-ts/auxiliary/Functional` removed
- Transform aliases removed from `@jonloucks/contracts-ts/api/Types`

### Replacements
- Use `@jonloucks/contracts-ts/api/Convenience` for core helper imports
- Use `@jonloucks/contracts-ts/auxiliary/Convenience` or direct `auxiliary/*` imports for functional/auxiliary helpers
- Use `@jonloucks/contracts-ts/auxiliary/Transform` for transform type aliases/utilities

## Development Workflow

```bash
npm install
npm run build
npm test
npm run lint
npm run docs
```

## Additional References

- API Reference (TypeDoc): https://jonloucks.github.io/contracts-ts/typedoc/
- Coverage Report: https://jonloucks.github.io/contracts-ts/lcov-report/
- Release Notes: `notes/release-notes-v*.md`

## Governance and Contribution

- Contribution Guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Coding Standards: [CODING_STANDARDS.md](CODING_STANDARDS.md)
- Security Policy: [SECURITY.md](SECURITY.md)
- Code of Conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
