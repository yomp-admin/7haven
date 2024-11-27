export function debounce<T, A extends unknown[]>(
	fn: (...args: A) => T,
	wait: number
): (...args: A) => void {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: A) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), wait);
	};
}

export const handleFetch = async <T>(fn: () => Promise<T>): Promise<[null, T] | [Error, null]> => {
	try {
		const result = await fn();
		return [null, result];
	} catch (error) {
		return [error as Error, null];
	}
};
