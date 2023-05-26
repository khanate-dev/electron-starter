const { ipcRenderer, contextBridge } = require('electron');

/** @type {import('~/shared/types/ipc').IpcApi} */
const ipcApi = {
	app: {
		environment: process.env.DEV ? 'development' : 'production',
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

contextBridge.exposeInMainWorld('ipc', ipcApi);
