# contracts-ts

> ⚠️ **PROJECT SETUP IN PROGRESS**
>
> This project is currently being set up. There is no production code or stable documentation available at this time.
> Please check back later for updates.

## Badges
[![CI](https://github.com/jonloucks/contracts-ts/workflows/CI/badge.svg)](https://github.com/jonloucks/contracts-ts/actions)
[![npm version](https://badge.fury.io/js/contracts-ts.svg)](https://www.npmjs.com/package/contracts-ts)
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
npm install contracts-ts
```

## Usage

### Creating Contracts

```typescript
import { createContract, Contract } from 'contracts-ts';

// Define a service interface
interface Logger {
  log(message: string): void;
}

// Create a contract for the service
const LoggerContract = createContract<Logger>('Logger');
```

### Using the Container

```typescript
import { Container, createContract } from 'contracts-ts';

// Create a container
const container = new Container();

// Define a contract
interface Database {
  query(sql: string): Promise<any>;
}

const DatabaseContract = createContract<Database>('Database');

// Bind an implementation
const myDatabase: Database = {
  query: async (sql: string) => {
    // Implementation here
    return [];
  }
};

container.bind(DatabaseContract, myDatabase);

// Resolve the implementation
const db = container.resolve(DatabaseContract);
await db.query('SELECT * FROM users');
```

## Development

### Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Lint the code
npm run lint

# Fix linting issues
npm run lint:fix

# Generate documents
npm run docs

```

### Project Structure

```
contracts-ts/
├── src/
│   ├── contract.ts       # Contract definition and creation
│   ├── container.ts      # Dependency injection container
│   ├── index.ts          # Main exports
│   └── *.test.ts         # Test files
├── dist/                 # Compiled output (generated)
├── .github/
│   └── workflows/
│       ├── ci.yml        # CI workflow
│       └── publish.yml   # NPM publish workflow
├── jest.config.js        # Jest configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Package configuration
```

## GitHub Workflows

### CI Workflow

The CI workflow runs on every push and pull request to `main` branch. It:
- Tests against Node.js versions 18.x, 20.x, and 22.x
- Runs linting
- Builds the project
- Runs tests with coverage
- Uploads coverage to Codecov (optional)

### Publish Workflow

The publish workflow runs when a new release is created. It:
- Builds the project
- Runs tests
- Publishes to npm (requires `NPM_TOKEN` secret)

To set up publishing:
1. Create an npm account and generate an access token
2. Add the token as a secret named `NPM_TOKEN` in your GitHub repository settings

## License

MIT