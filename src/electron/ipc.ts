import { app, ipcMain } from 'electron';

import { setupSerialPorts } from './serial-port';

import type { BrowserWindow } from 'electron';

export const setupIpc = (mainWindow: BrowserWindow) => {
	ipcMain.on('closeApplication', () => app.exit());
	setupSerialPorts(mainWindow);
};
