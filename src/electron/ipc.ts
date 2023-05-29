import { app } from 'electron';
import os from 'os';

import { SerialPort } from 'serialport';

import { main } from '~/shared/ipc-spec';

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
	reader.open();

	main.on('closeApplication', () => app.exit());

	main.handle('connectBarCodeReader', async () => {
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
	});

	main.handle('disconnectBarCodeReader', async () => {
		if (!reader.isOpen || reader.closing) return;
		return new Promise<void>((resolve, reject) => {
			reader.close((error) => {
				error ? reject(error) : resolve();
			});
		});
	});

	reader.on('data', (data) => {
		const dataString = data.toString('utf-8');
		const newBarCodeScan = parseInt(dataString);
		main.send(mainWindow, 'onBarCodeData', newBarCodeScan);
	});
};
