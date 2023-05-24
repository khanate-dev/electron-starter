export type IpcMethods = {
	getIsPackaged: () => boolean;
	closeApplication: () => void;
};

declare global {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface
	interface Window extends IpcMethods {}
}
