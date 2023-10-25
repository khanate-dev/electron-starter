import { useSyncExternalStore } from 'react';
import { z } from 'zod';

import { createStore } from '~/helpers/store.helpers';

export const modes = ['dark', 'light', 'system'] as const;
export type Mode = (typeof modes)[number];

const store = createStore({
	key: 'mode',
	schema: z.enum(modes),
	defaultVal: 'system',
});

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

const getMode = () => {
	const stored = store.get();
	const mode =
		stored === 'system' ? (prefersDark.matches ? 'dark' : 'light') : stored;
	return mode;
};

const subscribe = (callback: () => void) => {
	const listener = (event: StorageEvent | MediaQueryListEvent) => {
		if (event instanceof StorageEvent) {
			if (event.key && event.key !== 'mode') return;
			callback();
		} else {
			const mode = store.get();
			if (mode === 'system') callback();
		}
	};
	window.addEventListener('storage', listener);
	prefersDark.addEventListener('change', listener);
	return () => {
		window.removeEventListener('storage', listener);
		prefersDark.removeEventListener('change', listener);
	};
};

export const updateMode = (value: Mode) => {
	store.set(value);
};

export const useStoredMode = () => {
	const mode = useSyncExternalStore(subscribe, store.get);
	return mode;
};

export const useMode = () => {
	const mode = useSyncExternalStore(subscribe, getMode);
	return mode;
};
