// TODO: helper functions
/**
 * Converts duration in minutes to "H hrs M mins" format.
 * Expects duration as total minutes (number).
 */
export function formatDuration(totalMinutes) {
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${hrs} hr${hrs !== 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
}

/**
 * Safely get a nested property or return a default.
 */
export function getNested(obj, path, defaultValue = undefined) {
  return path
    .split('.')
    .reduce((o, key) => (o && o[key] !== undefined ? o[key] : undefined), obj)
    ?? defaultValue;
}
