import type { IpcMethods } from '~/electron/ipc';

declare global {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface
	interface Window extends IpcMethods {}
}
