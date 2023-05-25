import { app, ipcMain } from 'electron';

import { setupReader } from './serial-port';

import type { BrowserWindow } from 'electron';
import type { IpcApi } from '@shared/types/ipc';

export const setupIpc = (mainWindow: BrowserWindow) => {
	ipcMain.handle('getIsPackaged', (async () =>
		Promise.resolve(app.isPackaged)) satisfies IpcApi['app']['getIsPackaged']);

	ipcMain.on('closeApplication', (() =>
		app.exit()) satisfies IpcApi['app']['closeApplication']);

	setupReader(mainWindow);
};