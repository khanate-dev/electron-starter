export const electronConfig = {
	id: 'electron-app',
	name: 'Electron App',
	description: 'Electron React Application',
	icnsIcon: './src/app/assets/favicon/icons/mac/icns.ico',
	icoIcon: './src/app/assets/favicon/icons/win/icon.ico',
	pngIcon: './src/app/assets/favicon/favicon.png',
	repository: {
		owner: 'khanate-dev',
		name: 'electron-react-webpack-starter',
	},
	isDev: Boolean(process.env.DEV),
	env: process.env.DEV ? 'development' : 'production',
} as const;
