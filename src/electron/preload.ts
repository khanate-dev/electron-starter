import { contextBridge } from 'electron';

import { ipcApiKey, ipcRenderer } from '~/shared/ipc-spec';

import { electronConfig } from './electron.config';

import type { IpcApi } from '~/shared/ipc-spec';

const ipcApi: IpcApi = {
	app: {
		env: electronConfig.env,
		exit() {
			ipcRenderer.send('appExit');
		},
	},
	barCode: {
		async connect() {
			return ipcRenderer.invoke('barCodeConnect');
		},
		async disconnect() {
			return ipcRenderer.invoke('barCodeDisconnect');
		},
		listen(callback) {
			ipcRenderer.on('barCodeListen', (_event, value) => {
				callback(value);
			});
		},
	},
};

contextBridge.exposeInMainWorld(ipcApiKey, ipcApi);
