import type { z } from 'zod';

export const getLocalStorage = <
	Schema extends z.ZodSchema,
	Default extends Schema['_output'] = never,
>(
	key: string,
	schema: Schema,
	defaultVal?: Default,
): Schema['_output'] | ([Default] extends [never] ? null : Default) => {
	try {
		const string = window.localStorage.getItem(key);
		if (!string) throw new Error('not found');
		return schema.parse(string) as never;
	} catch {
		if (defaultVal !== undefined) {
			window.localStorage.setItem(
				key,
				typeof defaultVal === 'string'
					? defaultVal
					: JSON.stringify(defaultVal),
			);
			return defaultVal as never;
		}
		window.localStorage.removeItem(key);
		return null;
	}
};

export const setLocalStorageAndDispatch = (key: string, newValue: string) => {
	const oldValue = window.localStorage.getItem(key);
	window.localStorage.setItem(key, newValue);
	window.dispatchEvent(
		new StorageEvent('storage', { key, oldValue, newValue }),
	);
};

export const removeLocalStorageAndDispatch = (key: string) => {
	const oldValue = window.localStorage.getItem(key);
	window.localStorage.removeItem(key);
	window.dispatchEvent(
		new StorageEvent('storage', { key, oldValue, newValue: null }),
	);
};
