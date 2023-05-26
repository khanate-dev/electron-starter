import os from 'os';
import { ipcMain } from 'electron';

import { SerialPort } from 'serialport';

import type { BrowserWindow } from 'electron';
import type { IpcApi } from '~/shared/types/ipc';

const paths: Partial<Record<NodeJS.Platform, string>> & { default: string } = {
	win32: 'COM102',
	linux: '/dev/ttyUSB0',
	default: '/dev/ttyUSB0',
};

type T = IpcApi['barCodeReader'];

export const setupSerialPorts = (mainWindow: BrowserWindow) => {
	const reader = new SerialPort({
		path: paths[os.platform()] ?? paths.default,
		autoOpen: false,
		baudRate: 9600,
	});

	const connectBarCodeReader: T['connect'] = async () => {
		if (reader.isPaused()) {
			reader.resume();
			return;
		}
		if (reader.isOpen || reader.opening) return;
		return new Promise<void>((resolve, reject) => {
			reader.open((error) => {
				error ? reject(error) : resolve();
			});
		});
	};

	const disconnectBarCodeReader: T['disconnect'] = async () => {
		if (!reader.isOpen || reader.closing) return;
		return new Promise<void>((resolve, reject) => {
			reader.close((error) => {
				error ? reject(error) : resolve();
			});
		});
	};

	ipcMain.handle('connectBarCodeReader', connectBarCodeReader);
	ipcMain.handle('disconnectBarCodeReader', disconnectBarCodeReader);

	reader.on('data', (data) => {
		const dataString = data.toString('utf-8');
		const newBarCodeScan = parseInt(dataString);
		mainWindow.webContents.send('onRead', newBarCodeScan);
	});
};
