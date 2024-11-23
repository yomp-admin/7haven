// Custom debounce utility
export function debounce<T, A extends unknown[]>(fn: (...args: A) => T, wait: number): (...args: A) => void {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: A) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn(...args), wait);
	};
}
