import type { z } from 'zod';

type Storage = 'localStorage' | 'sessionStorage';

type CreateStoreOpts<
	Schema extends z.ZodSchema,
	Default extends Schema['_output'] = never,
> = {
	/** the key to store the value under */
	key: string;
	/** the storage to use. @default `localStorage` */
	storage?: Storage;
	/** the `zod` schema to validate the stored value against */
	schema: Schema;
	/** the default value to assign to store */
	defaultVal?: Default;
};

export type Store<
	Schema extends z.ZodSchema,
	Default extends Schema['_output'] = never,
> = {
	key: string;
	defaultVal: Default;
	storage: Storage;
	get: () => Schema['_output'] | ([Default] extends [never] ? null : Default);
	set: (value: Schema['_output']) => void;
	remove: () => void;
};

export const createStore = <
	Schema extends z.ZodSchema,
	Default extends Schema['_output'] = never,
>({
	key,
	storage = 'localStorage',
	schema,
	defaultVal,
}: CreateStoreOpts<Schema, Default>): Store<Schema, Default> => {
	const store = window[storage];
	return {
		key,
		defaultVal: defaultVal as never,
		storage,
		get: () => {
			try {
				const string = store.getItem(key);
				if (!string) throw new Error('not found');
				return schema.parse(JSON.parse(string)) as never;
			} catch {
				if (defaultVal !== undefined) {
					store.setItem(key, JSON.stringify(defaultVal));
					return defaultVal as never;
				}
				store.removeItem(key);
				return null;
			}
		},
		set: (value: Schema['_output']) => {
			const oldValue = store.getItem(key);
			const newValue = JSON.stringify(value);
			store.setItem(key, newValue);
			window.dispatchEvent(
				new StorageEvent('storage', { key, oldValue, newValue }),
			);
		},
		remove: () => {
			const oldValue = store.getItem(key);
			store.removeItem(key);
			window.dispatchEvent(
				new StorageEvent('storage', { key, oldValue, newValue: null }),
			);
		},
	};
};
