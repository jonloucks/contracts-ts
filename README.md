# @jonloucks/contracts-ts

## Badges
[![CI](https://github.com/jonloucks/contracts-ts/workflows/CI/badge.svg)](https://github.com/jonloucks/contracts-ts/actions)
[![npm version](https://raw.githubusercontent.com/jonloucks/contracts-ts/refs/heads/badges/main-npm.svg)](https://www.npmjs.com/package/@jonloucks/contracts-ts)
[![Coverage Badge](https://raw.githubusercontent.com/jonloucks/contracts-ts/refs/heads/badges/main-coverage.svg)](https://jonloucks.github.io/contracts-ts/lcov-report/)
[![Typedoc Badge](https://raw.githubusercontent.com/jonloucks/contracts-ts/refs/heads/badges/main-typedoc.svg)](https://jonloucks.github.io/contracts-ts/typedoc/)


Typescript Dependency Contracts for dependency inversion

## Documentation
* [License](LICENSE.md)
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

## Usage - code fragments from Example.test.ts

<details markdown="1"><summary>Creating a Contract</summary>

```typescript
import { createContract, Contract, CONTRACTS } from '@jonloucks/contracts-ts';

// Define a service interface
interface Logger {
    log(message: string): void;
}

// Create a contract for the service
const LOGGER_CONTRACT: Contract<Logger> = createContract<Logger>({
    name: "Logger",
    test: (obj: any): obj is Logger => { // example of duck-typing check
        return typeof obj.log === "function";
    }
});
```
</details>

<details markdown="1"><summary>Importing the Package</summary>

```typescript
import { CONTRACTS, createContract, PromisorFactory, PROMISOR_FACTORY } from '@jonloucks/contracts-ts';
```

</details>

<details markdown="1"><summary>Binding a Contract</summary>

```typescript

// Optional - PromisorFactory is not required, but provides trivial and advanced ways to create Promisors
let promisorFactory : PromisorFactory = CONTRACTS.enforce<PromisorFactory>(PROMISOR_FACTORY);

CONTRACTS.bind<Logger>(LOGGER_CONTRACT,
    promisorFactory.createSingleton<Logger>(
        () => ({
            log: (message: string) => {
                console.log("LOG:", message);
            }
        })));
```
</details>

<details markdown="1"><summary>Using the Contract</summary>

```typescript
const logger : Logger = CONTRACTS.enforce<Logger>(LOGGER_CONTRACT);
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
├── editorconfig
├── eslint.config.mjs
├── jest.config.js
├── LICENSE
├── package-lock.json
├── package.json
├── PULL_REQUEST_TEMPLATE.md
├── README.md
├── scripts
│   ├── badge-template.svg.dat
│   └── tsconfig.json
├── SECURITY.md
├── src
│   ├── index.ts
│   ├── api
│   │   ├── *.ts
│   │   ├── *.api.ts
│   ├── impl
│   │   ├── *.ts
│   │   ├── *.impl.ts
│   │   ├── *.test.ts    // internal implementation specific
│   │   └── *.api.ts
│   ├── test
│   │   └── *.test.ts
│   └── utils             // non shippable development scripts
│       ├── *.ts
│       └── *.test.ts
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
