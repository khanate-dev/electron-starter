import os from 'os';
import { ipcMain } from 'electron';

import { SerialPort } from 'serialport';

import { humanizeToken } from '@shared/helpers/string';

import type { BrowserWindow } from 'electron';

export const ports: Record<
	'weightScale' | 'uhfReader' | 'qrCodeReader',
	{
		path: Partial<Record<NodeJS.Platform, string>> & { default: string };
		baudRate?: number;
	}
> = {
	weightScale: {
		path: {
			win32: 'COM100',
			linux: '/dev/weightScale',
			default: '/dev/weightScale',
		},
	},
	uhfReader: {
		path: {
			win32: 'COM101',
			linux: '/dev/uhfReader',
			default: '/dev/uhfReader',
		},
		baudRate: 115200,
	},
	qrCodeReader: {
		path: {
			win32: 'COM102',
			linux: '/dev/qrCodeReader',
			default: '/dev/qrCodeReader',
		},
	},
};

export const createSerialPortObject = (port: keyof typeof ports) => {
	const config = ports[port];
	const path = config.path[os.platform()] ?? config.path.default;
	return new SerialPort({
		path,
		autoOpen: false,
		baudRate: config.baudRate ?? 9600,
	});
};

export const handleSerialConnection = (
	portName: keyof typeof ports,
	port: SerialPort
) => {
	return async (_event?: Event, isClose?: boolean) =>
		new Promise<void>((resolve, reject) => {
			const handleResponse = (error: Error | null) => {
				if (error) return reject(error.message);
				console.info(
					`${isClose ? 'Disconnected From' : 'Connected To'} ${humanizeToken(
						portName
					)}!`
				);
				resolve();
			};

			if (isClose && !port.isOpen) {
				reject(new Error('Port Is Not Open'));
			} else if (isClose) {
				port.close(handleResponse);
			} else if (port.isOpen) {
				if (port.isPaused()) port.resume();
				resolve();
			} else {
				port.open(handleResponse);
			}
		});
};

export const setupSerialPorts = (mainWindow: BrowserWindow) => {
	//! Weight Scale

	const weightScale = createSerialPortObject('weightScale');
	ipcMain.handle(
		'weightScaleConnection',
		handleSerialConnection('weightScale', weightScale)
	);

	let currentWeightReading = 0;
	weightScale.on('data', (data) => {
		const dataString = data.toString('utf-8');
		const newWeightReading = parseFloat(
			dataString.split('=')?.[1]?.split?.('').reverse?.().join('')
		);
		const isDataValid =
			dataString.match(/^[\s]*=[\s]*[0-9]*[\s]*$/giu) &&
			!isNaN(newWeightReading) &&
			newWeightReading !== 0 &&
			newWeightReading !== currentWeightReading;

		if (isDataValid) {
			currentWeightReading = newWeightReading;
			mainWindow.webContents.send('onWeight', newWeightReading);
		}
	});

	//! UHF Reader

	const uhfReader = createSerialPortObject('uhfReader');
	ipcMain.handle(
		'uhfReaderConnection',
		handleSerialConnection('uhfReader', uhfReader)
	);

	uhfReader.on('data', (data) => {
		const dataString = data.toString('utf-8');
		const newUhfReading = parseFloat(dataString.split('=')?.[1]);
		const isDataValid =
			dataString.match(/^[\s]*jobId[\s]*=[\s]*[0-9]*[\s]*$/giu) &&
			!isNaN(newUhfReading) &&
			newUhfReading !== 0;

		if (isDataValid) mainWindow.webContents.send('onUhfCard', newUhfReading);
	});

	uhfReader.on('pause', () => uhfReader.resume());

	//! QR Code Reader

	const qrCodeReader = createSerialPortObject('qrCodeReader');
	ipcMain.handle(
		'qrCodeReaderConnection',
		handleSerialConnection('qrCodeReader', qrCodeReader)
	);

	qrCodeReader.on('data', (data) => {
		const dataString = data.toString('utf-8');
		const newQrCodeScan = parseFloat(dataString.split('-')?.[1]);
		const isDataValid =
			dataString.match(/^[\s]*P-[0-9]*[\s]*$/giu) &&
			!isNaN(newQrCodeScan) &&
			newQrCodeScan !== 0;

		if (isDataValid) mainWindow.webContents.send('onQrCode', newQrCodeScan);
	});
};
