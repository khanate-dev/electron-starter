import { contextBridge } from 'electron';

import { renderer } from '~/shared/ipc-spec';

import type { IpcApi } from '~/shared/ipc-spec';

const ipcApi: IpcApi = {
	app: {
		environment: process.env.DEV ? 'development' : 'production',
		closeApplication: () =>
			renderer.app.closeApplication('appCloseApplication'),
	},
	barCode: {
		connect: async () => {
			return renderer.barCode.connect('barCodeConnect');
		},
		disconnect: async () => {
			return renderer.barCode.disconnect('barCodeDisconnect');
		},
		listen: (callback) => {
			renderer.barCode.listen('barCodeListen', (_event, value) => {
				callback(value);
			});
		},
	},
};

contextBridge.exposeInMainWorld('ipc', ipcApi);
