import { app } from 'electron';

import { codeReader } from './serial-port';

import { ipcMain } from '../shared/ipc';

import type { BrowserWindow } from 'electron';

export const setupIpc = (mainWindow: BrowserWindow) => {
	ipcMain.on('appExit', (_, exitCode) => {
		app.exit(exitCode);
	});

	ipcMain.handle('codeReaderConnect', codeReader.connect);

	ipcMain.handle('codeReaderDisconnect', codeReader.disconnect);

	codeReader.listen((code) => {
		ipcMain.send('codeReaderListen', mainWindow, code);
	});
};
