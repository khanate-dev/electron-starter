/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { ipcRenderer, ipcMain } from 'electron';

import type { BrowserWindow } from 'electron';
import type { Utils } from '~/shared/types/utils';

export type IpcApi = {
	app: {
		environment: 'development' | 'production';
		closeApplication: () => void;
	};
	barCode: {
		connect: () => Promise<void>;
		disconnect: () => Promise<void>;
		listen: (listener: (value: number) => void) => void;
	};
};

declare global {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface
	interface Window {
		ipc: IpcApi;
	}
}

type Invoker<T> = T extends (...args: any[]) => Promise<any> ? T : never;

type Sender<T> = T extends (...args: infer Args extends any[]) => infer R
	? Utils.equal<R, void> extends true
		? Args extends [(...args: any[]) => void]
			? never
			: T
		: never
	: never;

type Listener<T> = T extends (...args: infer Args extends any[]) => infer R
	? Utils.equal<R, void> extends true
		? Args extends [(...args: any[]) => void]
			? T
			: never
		: never
	: never;

type ExcludingNonFuncs<T> = T extends
	| Record<string, unknown>
	| Invoker<T>
	| Sender<T>
	| Listener<T>
	? T
	: never;

type AppendPrefix<T extends PropertyKey, S extends string> = S extends ''
	? T
	: `${S}${Capitalize<T & string>}`;

type RemoveEmptyObjects<T extends Record<string, unknown>> = {
	[k in keyof T as T[k] extends Record<string, never> ? never : k]: T[k];
};

type Render<
	T extends Record<string, unknown>,
	Prefix extends string = ''
> = Utils.prettify<
	RemoveEmptyObjects<{
		[K in keyof T as T[K] extends ExcludingNonFuncs<T[K]>
			? K
			: never]: T[K] extends Record<string, unknown>
			? Render<T[K], AppendPrefix<K, Prefix>>
			: T[K] extends Invoker<T[K]>
			? (
					channel: AppendPrefix<K, Prefix>,
					...args: Parameters<T[K]>
			  ) => ReturnType<T[K]>
			: T[K] extends Sender<T[K]>
			? (channel: AppendPrefix<K, Prefix>, ...args: Parameters<T[K]>) => void
			: T[K] extends Listener<T[K]>
			? Parameters<T[K]> extends [
					(...args: infer ListenerArgs extends any[]) => void
			  ]
				? (
						channel: AppendPrefix<K, Prefix>,
						listener: (
							event: Electron.IpcRendererEvent,
							...args: ListenerArgs
						) => void
				  ) => void
				: never
			: never;
	}>
>;

export const renderer: Render<IpcApi> = {
	app: {
		closeApplication(channel) {
			ipcRenderer.send(channel);
		},
	},
	barCode: {
		async connect(channel) {
			return ipcRenderer.invoke(channel);
		},
		async disconnect(channel) {
			return ipcRenderer.invoke(channel);
		},
		listen(channel, listener) {
			return ipcRenderer.on(channel, listener);
		},
	},
};

type Main<
	T extends Record<string, unknown>,
	Prefix extends string = ''
> = Utils.prettify<
	RemoveEmptyObjects<{
		[K in keyof T as T[K] extends ExcludingNonFuncs<T[K]>
			? K
			: never]: T[K] extends Record<string, unknown>
			? Main<T[K], AppendPrefix<K, Prefix>>
			: T[K] extends Invoker<T[K]>
			? (
					channel: AppendPrefix<K, Prefix>,
					callback: (
						event: Electron.IpcMainInvokeEvent,
						...args: Parameters<T[K]>
					) => ReturnType<T[K]>
			  ) => void
			: T[K] extends Sender<T[K]>
			? (
					channel: AppendPrefix<K, Prefix>,
					handler: (
						event: Electron.IpcMainEvent,
						...args: Parameters<T[K]>
					) => void,
					...args: Parameters<T[K]>
			  ) => void
			: T[K] extends Listener<T[K]>
			? Parameters<T[K]> extends [
					(...args: infer ListenerArgs extends any[]) => void
			  ]
				? (
						channel: AppendPrefix<K, Prefix>,
						window: BrowserWindow,
						...args: ListenerArgs
				  ) => void
				: never
			: never;
	}>
>;

export const main: Main<IpcApi> = {
	app: {
		closeApplication(channel, handler, ...args) {
			ipcMain.on(channel, (event) => handler(event, ...args));
		},
	},
	barCode: {
		connect(channel, callback) {
			return ipcMain.handle(channel, callback);
		},
		disconnect(channel, callback) {
			return ipcMain.handle(channel, callback);
		},
		listen(channel, window, ...args) {
			window.webContents.send(channel, ...args);
		},
	},
};
