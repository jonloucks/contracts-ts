import { createContainer } from '../src';

// Define contracts (unique identifiers for dependencies)
const LoggerContract = Symbol('Logger');
const DatabaseContract = Symbol('Database');
const UserServiceContract = Symbol('UserService');

// Define interfaces
interface Logger {
  log(message: string): void;
}

interface Database {
  query(sql: string): any[];
}

interface UserService {
  getUser(id: number): any;
}

// Create a container
const container = createContainer();

// Bind a singleton logger
container.singleton<Logger>(LoggerContract, () => ({
  log: (message: string) => console.log(`[LOG] ${message}`),
}));

// Bind a singleton database that depends on the logger
container.singleton<Database>(DatabaseContract, (c) => {
  const logger = c.resolve<Logger>(LoggerContract);
  return {
    query: (sql: string) => {
      logger.log(`Executing query: ${sql}`);
      return []; // Mock result
    },
  };
});

// Bind a user service that depends on both logger and database
container.bind<UserService>(UserServiceContract, (c) => {
  const logger = c.resolve<Logger>(LoggerContract);
  const db = c.resolve<Database>(DatabaseContract);

  return {
    getUser: (id: number) => {
      logger.log(`Getting user ${id}`);
      const users = db.query(`SELECT * FROM users WHERE id = ${id}`);
      return users[0] || null;
    },
  };
});

// Resolve and use the user service
const userService = container.resolve<UserService>(UserServiceContract);
userService.getUser(123);

// Output:
// [LOG] Getting user 123
// [LOG] Executing query: SELECT * FROM users WHERE id = 123
