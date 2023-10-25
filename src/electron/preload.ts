import { contextBridge } from 'electron';

import { electronConfig } from './electron.config';

import { ipcApiKey, ipcRenderer } from '../shared/ipc';

import type { IpcApi } from '../shared/ipc';

const ipcApi: IpcApi = {
	app: {
		env: electronConfig.env,
		exit() {
			ipcRenderer.send('appExit');
		},
	},
	codeReader: {
		async connect() {
			return ipcRenderer.invoke('codeReaderConnect');
		},
		async disconnect() {
			return ipcRenderer.invoke('codeReaderDisconnect');
		},
		listen(callback) {
			ipcRenderer.on('codeReaderListen', (_event, value) => {
				callback(value);
			});
		},
	},
};

contextBridge.exposeInMainWorld(ipcApiKey, ipcApi);
