// TODO: utility functions
/**
 * Simple logging utility.
 * Writes timestamped messages to the console.
 */

const timestamp = () => new Date().toISOString();

/**
 * Log an informational message.
 * @param  {...any} args 
 */
export const info = (...args) => {
  console.log(`[INFO] ${timestamp()} -`, ...args);
};

/**
 * Log a warning message.
 * @param  {...any} args 
 */
export const warn = (...args) => {
  console.warn(`[WARN] ${timestamp()} -`, ...args);
};

/**
 * Log an error message.
 * @param  {...any} args 
 */
export const error = (...args) => {
  console.error(`[ERROR] ${timestamp()} -`, ...args);
};

export default { info, warn, error };
