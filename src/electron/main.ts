import { app, BrowserWindow } from 'electron';

import installExtension, {
	REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-assembler';

import { electronConfig } from './electron.config';
import { setupIpc } from './ipc';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) app.quit();

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// TODO Find a way to disallow dom types in shared and electron folder

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		minWidth: 700,
		minHeight: 500,
		resizable: true,
		autoHideMenuBar: true,
		title: electronConfig.name,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			sandbox: true,
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
			// ? https://github.com/doyensec/electronegativity/wiki/AUXCLICK_JS_CHECK
			disableBlinkFeatures: 'Auxclick',
		},
	});

	// and load the index.html of the app.
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	if (electronConfig.isDev) {
		installExtension(REACT_DEVELOPER_TOOLS)
			.then(() => {
				const win = BrowserWindow.getFocusedWindow();
				win?.webContents.on('did-frame-finish-load', () => {
					win.webContents.once('devtools-opened', () => {
						win.webContents.focus();
					});
					win.webContents.openDevTools({ mode: 'detach' });
				});
			})
			.catch((err) => {
				console.warn('Could Not Load React DevTools:', err);
			});
	}

	// ? https://github.com/doyensec/electronegativity/wiki/PERMISSION_REQUEST_HANDLER_GLOBAL_CHECK
	mainWindow.webContents.session.setPermissionRequestHandler(
		(_, permission, callback) => {
			const allowed: (typeof permission)[] = ['clipboard-read', 'fullscreen'];
			callback(allowed.includes(permission));
		},
	);

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

app.on('web-contents-created', (_, contents) => {
	// ? https://www.electronjs.org/docs/latest/tutorial/security#12-verify-webview-options-before-creation
	contents.on('will-attach-webview', (event) => {
		event.preventDefault();
	});

	// ? https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
	contents.on('will-navigate', (event, url) => {
		if (url !== MAIN_WINDOW_WEBPACK_ENTRY) event.preventDefault();
	});

	// ? https://www.electronjs.org/docs/latest/tutorial/security#14-disable-or-limit-creation-of-new-windows
	contents.setWindowOpenHandler(() => {
		return { action: 'deny' };
	});
});
