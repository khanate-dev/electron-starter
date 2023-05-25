// import os from 'os';
// import { ipcMain } from 'electron';

// import { SerialPort } from 'serialport';

// import type { BrowserWindow } from 'electron';
// import type { IpcApi } from '~/shared/types/ipc';

// const paths: Partial<Record<NodeJS.Platform, string>> & { default: string } = {
// 	win32: 'COM102',
// 	linux: '/dev/qrCodeReader',
// 	default: '/dev/qrCodeReader',
// };

// type T = IpcApi['barCodeReader'];

// export const setupReader = (mainWindow: BrowserWindow) => {
// 	const reader = new SerialPort({
// 		path: paths[os.platform()] ?? paths.default,
// 		autoOpen: false,
// 		baudRate: 115200,
// 	});

// 	const connectBarCodeReader: T['connect'] = async () => {
// 		if (reader.isPaused()) {
// 			reader.resume();
// 			return;
// 		}
// 		return new Promise<void>((resolve, reject) => {
// 			reader.open((error) => {
// 				error ? reject(error) : resolve();
// 			});
// 		});
// 	};

// 	const disconnectBarCodeReader: T['disconnect'] = async () => {
// 		if (!reader.isOpen) return;
// 		return new Promise<void>((resolve, reject) => {
// 			reader.open((error) => {
// 				error ? reject(error) : resolve();
// 			});
// 		});
// 	};

// 	ipcMain.handle('connectBarCodeReader', connectBarCodeReader);
// 	ipcMain.handle('disconnectBarCodeReader', disconnectBarCodeReader);

// 	reader.on('data', (data) => {
// 		const dataString = data.toString('utf-8');
// 		const newBarCodeScan = parseFloat(dataString.split('-')?.[1]);
// 		const isDataValid =
// 			dataString.match(/^[\s]*P-[0-9]*[\s]*$/giu) &&
// 			!isNaN(newBarCodeScan) &&
// 			newBarCodeScan !== 0;

// 		if (isDataValid) mainWindow.webContents.send('onRead', newBarCodeScan);
// 	});
// };
