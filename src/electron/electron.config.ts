export const electronConfig = {
	id: 'electron-starter',
	name: 'Electron Starter',
	description: 'Electron Vite React Application',
	icnsIcon: './src/app/assets/favicon/icons/mac/icns.ico',
	icoIcon: './src/app/assets/favicon/icons/win/icon.ico',
	pngIcon: './src/app/assets/favicon/favicon.png',
	repository: {
		owner: 'khanate-dev',
		name: 'electron-starter',
	},
	env: process.env.DEV ? 'development' : 'production',
} as const;
