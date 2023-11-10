import os from 'os';

import { SerialPort } from 'serialport';

import { promisify } from '@shared/helpers/async.helpers';

const paths: Partial<Record<NodeJS.Platform, string>> & { default: string } = {
	win32: 'COM102',
	linux: '/dev/ttyUSB0',
	default: '/dev/ttyUSB0',
};

const port = new SerialPort({
	path: paths[os.platform()] ?? paths.default,
	autoOpen: false,
	baudRate: 9600,
});

/**
 * the time in `milliseconds` to wait between 2 data reads.
 * Any reads within the debounce period are ignored.
 * */
const debounceTime = 1000;
let lastRead: number = 0;

export type SerialPortListener = (
	data:
		| { type: 'connected' | 'disconnected' | 'paused' | 'resumed' }
		| { type: 'data'; value: string }
		| { type: 'error'; error: Error },
) => void;

const listeners: Array<SerialPortListener> = [];

port.on('data', (data) => {
	const currTime = new Date().getTime();
	if (currTime - lastRead <= debounceTime) return;
	lastRead = currTime;
	const dataString = (data as { toString(encoding: string): string }).toString(
		'utf-8',
	);
	for (const cb of listeners) cb({ type: 'data', value: dataString });
});

port.on('close', () => {
	for (const cb of listeners) cb({ type: 'disconnected' });
});

port.on('open', () => {
	for (const cb of listeners) cb({ type: 'connected' });
});

port.on('error', (error) => {
	for (const cb of listeners) cb({ type: 'error', error });
});

port.on('pause', () => {
	for (const cb of listeners) cb({ type: 'paused' });
});

port.on('resume', () => {
	for (const cb of listeners) cb({ type: 'resumed' });
});

export const serialPort = {
	connect: () => {
		if (port.isOpen || port.opening) return;
		port.open();
	},
	disconnect: () => {
		if (!port.isOpen || port.closing) return;
		port.close();
	},
	resume: () => {
		if (!port.isPaused()) return;
		port.resume();
	},
	pause: () => {
		if (port.isPaused()) return;
		port.pause();
	},
	status: async () => {
		return promisify(
			port.isPaused() ? 'paused' : port.isOpen ? 'connected' : 'disconnected',
		);
	},
	listen: async (callback: SerialPortListener) => {
		listeners.push(callback);
		return promisify({
			remove: () => {
				listeners.splice(listeners.indexOf(callback), 1);
			},
		});
	},
};
