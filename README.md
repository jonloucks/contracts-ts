# @jonloucks/contracts-ts

## Badges
[![CI](https://github.com/jonloucks/contracts-ts/workflows/CI/badge.svg)](https://github.com/jonloucks/contracts-ts/actions)
[![npm version](https://raw.githubusercontent.com/jonloucks/contracts-ts/refs/heads/badges/main-npm.svg)](https://www.npmjs.com/package/@jonloucks/contracts-ts)
[![Coverage Badge](https://raw.githubusercontent.com/jonloucks/contracts-ts/refs/heads/badges/main-coverage.svg)](https://jonloucks.github.io/contracts-ts/lcov-report/)
[![Typedoc Badge](https://raw.githubusercontent.com/jonloucks/contracts-ts/refs/heads/badges/main-typedoc.svg)](https://jonloucks.github.io/contracts-ts/typedoc/)


Typescript Dependency Contracts for dependency inversion

## Documentation
* [Project documentation](DOCUMENTATION.md)
* [License](LICENSE)
* [Contributing](CONTRIBUTING.md)
* [Code of conduct](CODE_OF_CONDUCT.md)
* [Coding standards](CODING_STANDARDS.md)
* [Security policy](SECURITY.md)
* [Pull request template](PULL_REQUEST_TEMPLATE.md)
* [How to use API](https://jonloucks.github.io/contracts-ts/typedoc/)
* [Test coverage report](https://jonloucks.github.io/contracts-ts/lcov-report)

## Installation

```bash
npm install @jonloucks/contracts-ts
```

## v2.0.0 Migration Notes

v2.0.0 introduces a smaller root export surface, removes deprecated APIs, and finalizes ESM packaging.

<details markdown="1"><summary>Root package imports are intentionally minimal</summary>

Use root imports only for core exports:

```typescript
import {
    CONTRACTS,
    Contract,
    ContractConfig,
    ContractException,
    Contracts,
    ContractsConfig,
    createContract,
    createContracts,
    VERSION
} from "@jonloucks/contracts-ts";
```

For broader helper APIs, use convenience or explicit subpath imports:

```typescript
import { bind, enforce, createSingleton } from "@jonloucks/contracts-ts/api/Convenience";
import { createAtomicBoolean } from "@jonloucks/contracts-ts/auxiliary/Convenience";
```

</details>

<details markdown="1"><summary>Transform types moved out of api/Types</summary>

```typescript
// v1.x (removed)
// import { TransformType, typeToTransform } from "@jonloucks/contracts-ts/api/Types";

// v2.0.0
import { type Type as TransformType } from "@jonloucks/contracts-ts/auxiliary/Transform";
```

</details>

<details markdown="1"><summary>Functional barrel removed</summary>

```typescript
// v1.x (removed)
// import { TransformType } from "@jonloucks/contracts-ts/auxiliary/Functional";

// v2.0.0
import {
    type TransformType,
    transformFromType,
    transformGuard
} from "@jonloucks/contracts-ts/auxiliary/Convenience";
```

</details>

## Usage - code fragments from Example.test.ts

<details markdown="1"><summary>Importing the Package</summary>

```typescript
import { CONTRACTS, createContract } from '@jonloucks/contracts-ts';
```

</details>

<details markdown="1"><summary>Importing the Convenience Package</summary>

```typescript
import {
    type AutoClose,
  bind,
  claim,
    type Contract,
  createExtractor,
  createLifeCycle,
  createRepository,
  createSingleton,
  createValue,
  createContract,
  enforce,
  guardFunctions,
  isBound
} from "@jonloucks/contracts-ts/api/Convenience";
```

</details>

<details markdown="1"><summary>Creating a Contract</summary>

```typescript
// Define a service interface
interface Logger {
    log(message: string): void;
}

// Create a contract for the service
const LOGGER_CONTRACT: Contract<Logger> = createContract<Logger>({
    name: "Logger",
    test: (obj: unknown): obj is Logger => { // example of duck-typing check
    return guardFunctions(obj, 'log'); // example of using guardFunctions helper
    }
});
```
</details>

<details markdown="1"><summary>Binding a Contract</summary>

```typescript

bind<Logger>(LOGGER_CONTRACT,
    createSingleton<Logger>(
        () => ({
            log: (message: string) => {
                console.log("LOG:", message);
            }
        })));
```
</details>

<details markdown="1"><summary>Using the Contract</summary>

```typescript
const logger : Logger = enforce<Logger>(LOGGER_CONTRACT);
logger.log("Using the service in the test.");
```
</details>

## Development

<details markdown="1"><summary>Install dependencies</summary>

```bash
npm install
```
</details>

<details markdown="1"><summary>Build the project</summary>

```bash
npm run build
```
</details>

<details markdown="1"><summary>Run tests</summary>

```bash
npm test
```
</details>

<details markdown="1"><summary>Run tests in watch mode</summary>

```bash
npm run test:watch
```
</details>

<details markdown="1"><summary>Run test coverage</summary>

```bash
npm run test:coverage
```
</details>

<details markdown="1"><summary>Lint the code</summary>

```bash
npm run lint
```
</details>

<details markdown="1"><summary>Fix linting issues</summary>

```bash
npm run lint:fix
```
</details>

<details markdown="1"><summary>Generate documents</summary>

```bash
npm run docs
```
</details>

<details markdown="1"><summary>Generate badges</summary>

```bash
npm run badges
```
</details>

<details markdown="1"><summary>Project Structure</summary>

* All tests must have suffix of -test.ts or -spec.ts
* Tests that validate supported APIs go in src/test
* Tests that validate internal implementation details go in src/impl

```
contracts-ts
├── .github
│   ├── ISSUE_TEMPLATE
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── workflows
│       ├── main-pull-request-matrix.yml
│       ├── main-pull-request.yml
│       ├── main-push.yml
│       └── main-release.yml
├── CODE_OF_CONDUCT.md
├── CODING_STANDARDS.md
├── CONTRIBUTING.md
├── DOCUMENTATION.md
├── .editorconfig
├── eslint.config.mjs
├── LICENSE
├── package-lock.json
├── package.json
├── PULL_REQUEST_TEMPLATE.md
├── README.md
├── SECURITY.md
├── src
│   ├── index.ts
│   ├── version.ts
│   ├── api
│   │   └── *.ts
│   ├── auxiliary
│   │   └── *.ts
│   ├── impl
│   │   ├── *.ts
│   │   └── *.test.ts    // internal implementation specific
│   ├── test
│   │   └── *.test.ts
│   └── never-publish             // non shippable development scripts (if present)
├── tsconfig.json
└── typedoc.json
```
</details>

## GitHub Workflows

<details markdown="1"><summary>CI Workflow</summary>

The CI workflow runs on every push and pull request to `main` branch. It:
- Tests against Node.js versions 18.x, 20.x, 22.x, and 24.x
- Runs linting
- Builds the project
- Runs tests with coverage
- Uploads coverage to Codecov (optional)

Compatibility note:
- Production `AutoClose` implementations intentionally support both `Symbol.dispose` and `Symbol.for("Symbol.dispose")` keys, so `using`-based disposal remains stable when running in environments that do not provide `Symbol.dispose` (for example, Node 16).

</details>

<details markdown="1"><summary>Publish Workflow</summary>

The GitHub publishings workflows are run to make an official release.
- If all scanning and tests pass it is published. There is no other way allowed.
- Publishing authentication is done using ([OIDC trusted publishing](https://docs.npmjs.com/trusted-publishers))

To set up your own publishing:
1. Publishing this project as is intentionally disabled
2. You are welcome to fork this repository and publish where you want.
3. Run `npm pkg delete private` to remove the `private` flag from the package.
4. Change the `name` field in `package.json` to your desired package name.

</details>

## License

MIT
