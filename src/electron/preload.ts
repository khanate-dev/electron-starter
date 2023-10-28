import { contextBridge } from 'electron';

import { ipcApiKey, ipcRenderer } from '@shared/ipc';

import { electronConfig } from './electron.config';

import type { IpcApi } from '@shared/ipc';

const ipcApi: IpcApi = {
	app: {
		env: electronConfig.env,
		exit() {
			ipcRenderer.send('appExit');
		},
	},
	serialPort: {
		connect() {
			ipcRenderer.send('serialPortConnect');
		},
		disconnect() {
			ipcRenderer.send('serialPortDisconnect');
		},
		resume() {
			ipcRenderer.send('serialPortResume');
		},
		pause() {
			ipcRenderer.send('serialPortPause');
		},
		async status() {
			return ipcRenderer.invoke('serialPortStatus');
		},
		listen(callback) {
			ipcRenderer.on('serialPortListen', (_event, value) => {
				callback(value);
			});
		},
	},
};

contextBridge.exposeInMainWorld(ipcApiKey, ipcApi);
