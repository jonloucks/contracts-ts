import { isNotPresent, OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { IllegalArgumentException } from "@jonloucks/contracts-ts/auxiliary/IllegalArgumentException";

/**
 * Check if given Contract is not null or invalid
 *
 * @param contract the Contract to check
 * @param <T>      the deliverable type
 * @return a valid contract
 * @throws IllegalArgumentException when invalid
 */
export const contractCheck: <T>(contract: OptionalType<T>)
  => RequiredType<T>
  = <T>(contract: OptionalType<T>) => {
    return presentCheck(contract, "Contract must be present.");
  }

/**
 * Check if given Contracts is not null or invalid
 * @param contracts the Contracts to check
 * @return a valid Contracts
 */
export const contractsCheck: <T>(contracts: OptionalType<T>)
  => RequiredType<T>
  = <T>(contracts: OptionalType<T>) => {
    return presentCheck(contracts, "Contracts must be present.");
  }

/**
 * Check if given Promisor is not null or invalid
 *
 * @param promisor the Promisor to check
 * @param <T>      the deliverable type
 * @return a valid promisor
 * @throws IllegalArgumentException when invalid
 */
export const promisorCheck: <T>(promisor: OptionalType<T>)
  => RequiredType<T>
  = <T>(promisor: OptionalType<T>) => {
    return presentCheck(promisor, "Promisor must be present.");
  }

/**
 * Check if given config is not null or invalid
 *
 * @param config the config to check
 * @param <T>      the type of config
 * @return a valid config
 * @throws IllegalArgumentException when invalid
 */
export const configCheck: <T>(config: OptionalType<T>)
  => RequiredType<T>
  = <T>(config: OptionalType<T>) => {
    return presentCheck(config, "Config must be present.");
  }

/**
 * Check if given type is not null or invalid
 *
 * @param {*} type the type to check
 * @returns a valid type
 */
export const typeCheck: <T>(name: OptionalType<T>)
  => RequiredType<T>
  = <T>(name: OptionalType<T>) => {
    return presentCheck(name, "Type must be present.");
  }

/**
 * Check if given name is not null or invalid
 *
 * @param {*} name the name to check
 * @returns a valid name
 */
export const nameCheck: <T>(name: OptionalType<T>)
  => RequiredType<T>
  = <T>(name: T) => {
    return presentCheck(name, "Name must be present.");
  }

/**
 * Check if given message is not null or invalid
 * 
 * @param {*} value the message to check
 * @returns a valid message
 */
export const messageCheck: <T>(value: OptionalType<T>)
  => RequiredType<T>
  = <T>(value: OptionalType<T>) => {
    return presentCheck(value, "Message must be present.");
  }

/**
 * Check if given instance is not null
 * 
 * @param {*} value the instance to check
 * @param {*} message the message used if an exception is thrown
 * @returns the value passed
 */
export const presentCheck: <T>(value: OptionalType<T>, message: string)
  => RequiredType<T>
  = <T>(value: OptionalType<T>, message: string) => {
    return illegalCheck(value, isNotPresent(value), message) as RequiredType<T>;
  };

/**
* Check if given instance is not null
* 
* @param {*} value the instance to check
* @param {*} failed if true an IllegalArgumentException is thrown
* @param {*} message the message used if an exception is thrown
* @returns the value passed in
*/
export const illegalCheck: <T>(value: T, failed: boolean, message: string)
  => T
  = <T>(value: T, failed: boolean, message: string) => {
    if (isNotPresent(message)) {
      throw new IllegalArgumentException("Message for illegal check must be present.");
    }
    if (failed) {
      throw new IllegalArgumentException(message);
    }
    return value;
  };

/**
 * explicity mark a value as used to avoid compiler warnings
 * useful for "using" variable which are used for disposal or other side-effects
 * but not directly referenced in code.
 * 
 * @param value the value which you wish to declare as used
 */
export const used: (value: unknown) 
  => void 
  = (value: unknown) => { void value; }