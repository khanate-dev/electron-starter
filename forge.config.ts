import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

import type { ForgeConfig } from '@electron-forge/shared-types';

const id = 'cbl-garment-tracking';
const name = 'CBL Garment Tracking';
const description = 'Garment Tracking Desktop Application For CBL';
const icoIcon = './src/app/assets/favicon/icon.ico';
const pngIcon = './src/app/assets/favicon.png';
const repository = {
	owner: 'WiMetrixDev',
	name: 'cbl-garment-tracking',
};

const config: ForgeConfig = {
	packagerConfig: {
		icon: icoIcon,
		name: id,
		executableName: id,
	},
	rebuildConfig: {},
	makers: [
		new MakerSquirrel({
			name: id,
			description,
			exe: name,
			setupExe: id,
			setupIcon: icoIcon,
		}),
		new MakerZIP({}, ['darwin']),
		new MakerRpm({
			options: {
				name: id,
				icon: pngIcon,
				categories: ['Office', 'Utility'],
				genericName: name,
				description,
				productName: name,
				productDescription: description,
			},
		}),
		new MakerDeb({
			options: {
				name: id,
				icon: pngIcon,
				categories: ['Office', 'Utility'],
				genericName: name,
				description,
				productName: name,
				productDescription: description,
				section: 'javascript',
			},
		}),
	],
	publishers: [
		{
			name: '@electron-forge/publisher-github',
			config: {
				repository,
			},
		},
	],
	plugins: [
		new WebpackPlugin({
			mainConfig,
			renderer: {
				config: rendererConfig,
				entryPoints: [
					{
						html: './src/app/index.html',
						js: './src/app/index.tsx',
						name: 'main_window',
						preload: {
							js: './src/electron/preload.cjs',
						},
					},
				],
			},
			devContentSecurityPolicy: `default-src 'self' 'unsafe-inline' data:; script-src 'self'; connect-src http: https: ws:`,
		}),
	],
};

// eslint-disable-next-line import/no-default-export
export default config;
