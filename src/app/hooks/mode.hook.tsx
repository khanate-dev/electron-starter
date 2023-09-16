import { useSyncExternalStore } from 'react';
import { z } from 'zod';

import {
	getLocalStorage,
	setLocalStorageAndDispatch,
} from '~/app/helpers/local-storage.helpers';

const modes = ['dark', 'light', 'system'] as const;
export type Mode = (typeof modes)[number];

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

const getLocalStorageMode = () => {
	return getLocalStorage('mode', z.enum(modes), 'system');
};

const getMode = () => {
	const stored = getLocalStorageMode();
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
			const mode = getLocalStorageMode();
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

export const toggleMode = () => {
	const prev = getLocalStorageMode();
	const newValue =
		prev === 'system' ? 'light' : prev === 'light' ? 'dark' : 'system';
	setLocalStorageAndDispatch('mode', newValue);
};

export const useStoredMode = () => {
	const mode = useSyncExternalStore(subscribe, getLocalStorageMode);
	return mode;
};

export const useMode = () => {
	const mode = useSyncExternalStore(subscribe, getMode);
	return mode;
};
