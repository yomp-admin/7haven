/**
 * Utility function to handle async operations with error handling
 * Returns a tuple of [error, result]
 * @param promise - The async function to execute
 * @returns [null, T] on success, [Error, null] on failure
 */

export const handleFetch = async <T>(fn: () => Promise<T>): Promise<[null, T] | [Error, null]> => {
	try {
		const result = await fn();
		return [null, result];
	} catch (error) {
		return [error as Error, null];
	}
};