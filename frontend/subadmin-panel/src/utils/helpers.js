// TODO: helper functions
/**
 * Extracts a user‐friendly error message from an Axios error.
 */
export function handleApiError(error) {
  console.error(error);
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return error.message || 'An unexpected error occurred';
}
