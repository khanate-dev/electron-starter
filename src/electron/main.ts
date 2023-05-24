import path from 'path';
import { app, BrowserWindow } from 'electron';

import { setupIpc } from './ipc';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) app.quit();

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		minWidth: 700,
		minHeight: 500,
		//fullscreen: true,
		resizable: true,
		backgroundColor: '#F4F4FE',
		autoHideMenuBar: true,
		icon: path.join(app.getAppPath(), 'src', 'images', 'favicon.png'),
		// frame: false,
		title: 'Garment Tracking',
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: app.isPackaged
				? MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
				: path.join(app.getAppPath(), 'src', 'main', 'preload.ts'),
		},
	});

	// and load the index.html of the app.
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	if (!app.isPackaged) mainWindow.webContents.openDevTools({ mode: 'detach' });

	// Setup IPC handlers and listeners.
	setupIpc(mainWindow);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
