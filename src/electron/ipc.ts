import { app, ipcMain } from 'electron';

import { setupSerialPorts } from './serial-port';

import type { BrowserWindow } from 'electron';

export type IpcMethods = {
	getIsPackaged: () => boolean;
	closeApplication: () => void;
};

export const setupIpc = (mainWindow: BrowserWindow) => {
	ipcMain.handle('getIsPackaged', () => app.isPackaged);
	ipcMain.on('closeApplication', () => app.exit());
	setupSerialPorts(mainWindow);
};
