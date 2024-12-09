/**
 * Utility function to handle async operations with error handling
 * Returns a tuple of [error, result]
 * @param promise - The async function to execute
 * @returns [null, T] on success, [Error, null] on failure
 */

export const handleFetch = async <T>(
  fn: () => Promise<T>
): Promise<[Error | undefined, T | undefined]> => {
  try {
    const result = await fn();
    return [undefined, result];
  } catch (error) {
    return [error as Error, undefined];
  }
};
