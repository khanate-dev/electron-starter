import os from 'os';

import { SerialPort } from 'serialport';

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

export const codeReader = {
	connect: async () => {
		return new Promise<void>((resolve, reject) => {
			if (port.isPaused()) {
				port.resume();
				resolve();
				return;
			}
			if (port.isOpen || port.opening) {
				resolve();
				return;
			}
			port.open((error) => {
				error ? reject(error) : resolve();
			});
		});
	},
	disconnect: async () => {
		return new Promise<void>((resolve, reject) => {
			if (!port.isOpen || port.closing) {
				resolve();
				return;
			}
			port.close((error) => {
				error ? reject(error) : resolve();
			});
		});
	},
	listen: (callback: (data: number) => void) => {
		port.on('data', (data) => {
			const dataString = (
				data as { toString(encoding: string): string }
			).toString('utf-8');
			const parsed = parseInt(dataString);
			callback(parsed);
		});
	},
};
