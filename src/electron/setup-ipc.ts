import { app } from 'electron';

import { ipcMain } from '@shared/ipc';

import { serialPort } from './serial-port';

import type { BrowserWindow } from 'electron';

export const setupIpc = (window: BrowserWindow) => {
	ipcMain.on('appExit', (_, exitCode) => {
		app.exit(exitCode);
	});

	ipcMain.on('serialPortConnect', serialPort.connect);
	ipcMain.on('serialPortDisconnect', serialPort.connect);
	ipcMain.on('serialPortResume', serialPort.resume);
	ipcMain.on('serialPortPause', serialPort.pause);
	ipcMain.handle('serialPortStatus', serialPort.status);
	serialPort.listen((data) => {
		ipcMain.send('serialPortListen', window, data);
	});
};
