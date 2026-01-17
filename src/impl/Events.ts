import { AutoOpen } from "@jonloucks/contracts-ts/api/AutoOpen";
export { AutoOpen } from "@jonloucks/contracts-ts/api/AutoOpen";

/**
 * Configuration for Events implementation
 */
export interface Config {
  names?: string[];

  callback: (...args: unknown[]) => void;
}

/**
 * Event listener management interface for process-level events.
 *
 * Implementations manage the open/close lifecycle for registering and
 * deregistering listeners on the Node.js process object.
 */
export interface Events extends AutoOpen {

  /**
   * Check if the event listeners are currently open.
   *
   * @returns true if the event listeners are open, false otherwise
   */
  isOpen(): boolean;
};