/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { ipcRenderer, ipcMain } from 'electron';

export type IpcApi = {
	app: {
		environment: Environment;
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

interface Renderer {
	send(channel: 'closeApplication'): void;
	invoke(
		channel: 'connectBarCodeReader' | 'disconnectBarCodeReader'
	): Promise<void>;
	on(
		channel: 'onBarCodeData',
		listener: (event: Electron.IpcRendererEvent, value: number) => void
	): void;
}

export const renderer: Renderer = {
	send(channel: 'closeApplication') {
		ipcRenderer.send(channel);
	},

	async invoke(channel: 'connectBarCodeReader' | 'disconnectBarCodeReader') {
		return ipcRenderer.invoke(channel);
	},

	on(
		channel: 'onBarCodeData',
		listener: (event: Electron.IpcRendererEvent, value: number) => void
	) {
		ipcRenderer.on(channel, listener);
	},
};

interface Main {
	handle(
		channel: 'connectBarCodeReader' | 'disconnectBarCodeReader',
		callback: (event: Electron.IpcMainInvokeEvent) => Promise<void>
	): void;
	on(
		channel: 'closeApplication',
		callback: (event: Electron.IpcMainInvokeEvent) => void
	): void;
	send(
		window: Electron.BrowserWindow,
		channel: 'onBarCodeData',
		value: number
	): void;
}

export const main: Main = {
	handle(
		channel: 'connectBarCodeReader' | 'disconnectBarCodeReader',
		callback: (event: Electron.IpcMainInvokeEvent) => Promise<void>
	) {
		ipcMain.handle(channel, callback);
	},

	on(
		channel: 'closeApplication',
		callback: (event: Electron.IpcMainInvokeEvent) => void
	) {
		ipcMain.on(channel, callback);
	},

	send(
		window: Electron.BrowserWindow,
		channel: 'onBarCodeData',
		value: number
	) {
		window.webContents.send(channel, value);
	},
};
