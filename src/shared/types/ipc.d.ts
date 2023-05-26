export type IpcApi = {
	app: {
		environment: Environment;
		closeApplication: () => void;
	};
	barCodeReader: {
		connect: () => Promise<void>;
		disconnect: () => Promise<void>;
		listen: (callback: (value: number) => void) => void;
	};
};

declare global {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface
	interface Window {
		ipc: IpcApi;
	}
}
