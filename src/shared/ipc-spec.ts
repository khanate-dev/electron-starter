/* eslint-disable @typescript-eslint/consistent-type-definitions */
import {
	ipcMain as electronIpcMain,
	ipcRenderer as electronIpcRenderer,
} from 'electron';

import type { App, BrowserWindow } from 'electron';
import type { Utils } from '~/shared/types/utils.types';

export type IpcApi = {
	app: Pick<App, 'exit'> & {
		env: 'development' | 'production';
	};
	barCode: {
		connect: () => Promise<void>;
		disconnect: () => Promise<void>;
		listen: (listener: (value: number) => void) => void;
	};
};

export const ipcApiKey = 'ipc';

// -----------------------
// Exporting the main and renderer ipc APIs with correct types
// Should not need to manually modify
// -----------------------

type ApiGlobal = {
	[k in typeof ipcApiKey]: IpcApi;
};

declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface Window extends ApiGlobal {}
}

type invoker<T> = T extends (...args: any[]) => Promise<unknown> ? T : never;

type sender<T> = T extends (...args: infer Args extends unknown[]) => infer R
	? Utils.equal<R, void> extends true
		? Args extends [(...args: any[]) => void]
			? never
			: T
		: never
	: never;

type listener<T> = T extends (...args: infer Args extends unknown[]) => infer R
	? Utils.equal<R, void> extends true
		? Args extends [(...args: any[]) => void]
			? T
			: never
		: never
	: never;

type appendPrefix<
	Str extends PropertyKey,
	Prefix extends string,
> = Prefix extends '' ? Str : `${Prefix}${Capitalize<Str & string>}`;

type flatIpcApi<
	T = IpcApi,
	Prefix extends string = '',
	K extends keyof T = keyof T,
> = Utils.prettify<
	Utils.unionToIntersection<
		K extends K
			? T[K] extends Record<string, unknown>
				? flatIpcApi<T[K], appendPrefix<K, Prefix>>
				: { [k in K as appendPrefix<K, Prefix>]: T[k] }
			: never
	>
>;

type senderFlatApi = {
	[k in keyof flatIpcApi as flatIpcApi[k] extends sender<flatIpcApi[k]>
		? k
		: never]: flatIpcApi[k];
};

type invokerFlatApi = {
	[k in keyof flatIpcApi as flatIpcApi[k] extends invoker<flatIpcApi[k]>
		? k
		: never]: flatIpcApi[k];
};

type listenerFlatApi = {
	[k in keyof flatIpcApi as flatIpcApi[k] extends listener<flatIpcApi[k]>
		? k
		: never]: flatIpcApi[k];
};

type renderListenerArgs<T extends keyof listenerFlatApi> = Parameters<
	Parameters<listenerFlatApi[T]>[0]
> extends infer args extends unknown[]
	? args
	: [];

type IpcRenderer = {
	send<T extends keyof senderFlatApi>(
		channel: T,
		...args: Parameters<senderFlatApi[T]>
	): void;
	invoke<T extends keyof invokerFlatApi>(
		channel: T,
		...args: Parameters<invokerFlatApi[T]>
	): Promise<Awaited<ReturnType<invokerFlatApi[T]>>>;
	on<
		T extends keyof listenerFlatApi,
		ListenerArgs extends unknown[] = renderListenerArgs<T>,
	>(
		channel: T,
		listener: (event: Electron.IpcRendererEvent, ...args: ListenerArgs) => void,
	): void;
};

export const ipcRenderer: IpcRenderer = {
	send(channel, ...args) {
		electronIpcRenderer.send(channel, ...args);
	},
	async invoke(channel, ...args) {
		return electronIpcRenderer.invoke(channel, ...args);
	},
	on(channel, listener) {
		return electronIpcRenderer.on(channel, listener as never);
	},
};

type IpcMain = {
	on<
		T extends keyof senderFlatApi,
		HandlerArgs extends unknown[] = Parameters<senderFlatApi[T]>,
	>(
		channel: T,
		handler: (event: Electron.IpcMainEvent, ...args: HandlerArgs) => void,
	): void;
	handle<
		T extends keyof invokerFlatApi,
		CallbackArgs extends unknown[] = Parameters<invokerFlatApi[T]>,
	>(
		channel: T,
		callback: (
			event: Electron.IpcMainInvokeEvent,
			...args: CallbackArgs
		) => Promise<Awaited<ReturnType<invokerFlatApi[T]>>>,
	): void;
	send<T extends keyof listenerFlatApi>(
		channel: T,
		window: BrowserWindow,
		...args: renderListenerArgs<T>
	): void;
};

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

// ? https://www.electronjs.org/docs/latest/tutorial/security#17-validate-the-sender-of-all-ipc-messages
const validateSender = (
	event: Electron.IpcMainEvent | Electron.IpcMainInvokeEvent,
): boolean => {
	return event.senderFrame.url === MAIN_WINDOW_WEBPACK_ENTRY;
};

export const ipcMain: IpcMain = {
	on(channel, handler) {
		electronIpcMain.on(channel, (event, ...args) => {
			if (!validateSender(event)) return;
			handler(event, ...(args as never));
		});
	},
	handle(channel, callback) {
		electronIpcMain.handle(channel, async (event, ...args) => {
			if (!validateSender(event)) {
				throw new Error(
					'Unauthorized! Invocations are limited to the main_window',
				);
			}
			return callback(event, ...(args as never));
		});
	},
	send(channel, window, ...args) {
		window.webContents.send(channel, ...args);
	},
};
