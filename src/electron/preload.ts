// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { ipcRenderer, contextBridge } from 'electron';

import type { IpcApi } from '~/shared/types/ipc';

const ipcApi: IpcApi = {
	app: {
		getIsPackaged: async () => ipcRenderer.invoke('getIsPackaged'),
		closeApplication: () => ipcRenderer.send('closeApplication'),
	},
	barCodeReader: {
		connect: async () => {
			return ipcRenderer.invoke(`connectBarCodeReader`).catch((error) => {
				const splitError = error?.toString()?.split?.(':');
				Promise.reject(
					splitError?.[splitError?.length - 1] ?? 'Something Went Wrong'
				);
			});
		},
		disconnect: async () => {
			return ipcRenderer.invoke(`disconnectBarCodeReader`);
		},
		listen: (callback) => {
			ipcRenderer.on('onRead', (_event, value) => {
				if (typeof value !== 'number') return;
				callback(value);
			});
		},
	},
};

contextBridge.exposeInMainWorld('bridge', ipcApi);
