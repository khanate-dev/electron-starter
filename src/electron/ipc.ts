import { app } from 'electron';
import os from 'os';

import { SerialPort } from 'serialport';

import { ipcMain } from '~/shared/ipc-spec';

import type { BrowserWindow } from 'electron';

const paths: Partial<Record<NodeJS.Platform, string>> & { default: string } = {
	win32: 'COM102',
	linux: '/dev/ttyUSB0',
	default: '/dev/ttyUSB0',
};

export const setupIpc = (mainWindow: BrowserWindow) => {
	const reader = new SerialPort({
		path: paths[os.platform()] ?? paths.default,
		autoOpen: false,
		baudRate: 9600,
	});

	ipcMain.on('appExit', (_, exitCode) => {
		app.exit(exitCode);
	});

	ipcMain.handle('barCodeConnect', async () => {
		return new Promise<void>((resolve, reject) => {
			if (reader.isPaused()) {
				reader.resume();
				return;
			}
			if (reader.isOpen || reader.opening) return;
			reader.open((error) => {
				error ? reject(error) : resolve();
			});
		});
	});

	ipcMain.handle('barCodeDisconnect', async () => {
		return new Promise<void>((resolve, reject) => {
			if (!reader.isOpen || reader.closing) return;
			reader.close((error) => {
				error ? reject(error) : resolve();
			});
		});
	});

	reader.on('data', (data) => {
		const dataString = (
			data as { toString(encoding: string): string }
		).toString('utf-8');
		const newBarCodeScan = parseInt(dataString);
		ipcMain.send('barCodeListen', mainWindow, newBarCodeScan);
	});
};
