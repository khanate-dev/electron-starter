import os from 'os';
import { ipcMain } from 'electron';

import { SerialPort } from 'serialport';

import type { BrowserWindow } from 'electron';

const paths: Partial<Record<NodeJS.Platform, string>> & { default: string } = {
	win32: 'COM102',
	linux: '/dev/qrCodeReader',
	default: '/dev/qrCodeReader',
};

export const setupReader = (mainWindow: BrowserWindow) => {
	const reader = new SerialPort({
		path: paths[os.platform()] ?? paths.default,
		autoOpen: false,
		baudRate: 115200,
	});

	ipcMain.handle('connectBarCodeReader', async () => {
		if (reader.isPaused()) return reader.resume();
		return new Promise<void>((resolve, reject) => {
			reader.open((error) => {
				error ? reject(error) : resolve();
			});
		});
	});

	ipcMain.handle('disconnectBarCodeReader', async () => {
		if (!reader.isOpen) return;
		return new Promise<void>((resolve, reject) => {
			reader.open((error) => {
				error ? reject(error) : resolve();
			});
		});
	});

	reader.on('data', (data) => {
		const dataString = data.toString('utf-8');
		const newBarCodeScan = parseFloat(dataString.split('-')?.[1]);
		const isDataValid =
			dataString.match(/^[\s]*P-[0-9]*[\s]*$/giu) &&
			!isNaN(newBarCodeScan) &&
			newBarCodeScan !== 0;

		if (isDataValid) mainWindow.webContents.send('onRead', newBarCodeScan);
	});
};
