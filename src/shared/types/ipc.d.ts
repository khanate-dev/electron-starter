export type IpcApi = {
	app: {
		environment: Environment;
		closeApplication: () => void;
	};
	settings: {
		get: (key: string) => Promise<string | undefined>;
		set: (key: string, value: string) => Promise<void>;
		remove: (key: string) => Promise<void>;
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
