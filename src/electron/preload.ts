import { contextBridge } from 'electron';

import { renderer } from '~/shared/ipc-spec';

import type { IpcApi } from '~/shared/ipc-spec';

const ipcApi: IpcApi = {
	app: {
		environment: process.env.DEV ? 'development' : 'production',
		closeApplication: () => renderer.send('closeApplication'),
	},
	barCode: {
		connect: async () => {
			return renderer.invoke('connectBarCodeReader');
		},
		disconnect: async () => {
			return renderer.invoke('disconnectBarCodeReader');
		},
		listen: (callback) => {
			renderer.on('onBarCodeData', (_event, value) => {
				if (typeof value !== 'number') return;
				callback(value);
			});
		},
	},
};

contextBridge.exposeInMainWorld('ipc', ipcApi);
