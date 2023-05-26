import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { app, ipcMain } from 'electron';

import { setupReader } from './serial-port';

import type { BrowserWindow } from 'electron';
import type { IpcApi } from '~/shared/types/ipc';

const configStorePath = path.join(app.getPath('userData'), 'config.json');

export const getSettings = async () =>
	JSON.parse(await readFile(configStorePath, 'utf-8')) as Record<
		string,
		unknown
	>;

export const setSettings = async (settings: Record<string, unknown>) =>
	writeFile(configStorePath, JSON.stringify(settings));

export const setupIpc = (mainWindow: BrowserWindow) => {
	ipcMain.on('closeApplication', (() =>
		app.exit()) satisfies IpcApi['app']['closeApplication']);

	ipcMain.handle('getSetting', async (_, key: string) => {
		const settings = await getSettings();
		return settings[key];
	});

	ipcMain.handle('setSetting', async (_, key: string, value: string) => {
		const settings = await getSettings();
		settings[key] = value;
		setSettings({
			...settings,
			[key]: value,
		});
	});

	ipcMain.handle('removeSetting', async (_, key: string) => {
		const settings = await getSettings();
		return setSettings({
			...settings,
			[key]: undefined,
		});
	});

	setupReader(mainWindow);
};
