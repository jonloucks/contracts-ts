/**
 * Idempotent state transition management interface.
 *
 * Implementations manage idempotent transitions between open and closed states.
 */
export interface Idempotent {
  /**
   * Transition to open state.
   *
   * @returns true if the state was changed to open, false if it was already open
   */
  transitionToOpen(): boolean;

  /**
   * Transition to closed state.
   *
   * @returns true if the state was changed to closed, false if it was already closed
   */
  transitionToClosed(): boolean;

  /**
   * Check if the state is open.
   *
   * @returns true if the state is open, false otherwise
   */
  isOpen(): boolean;
}