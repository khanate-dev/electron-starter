import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { electronConfig } from './src/electron/config';
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

import type { ForgeConfig } from '@electron-forge/shared-types';

const config: ForgeConfig = {
	packagerConfig: {
		icon: electronConfig.icoIcon,
		name: electronConfig.id,
		executableName: electronConfig.id,
	},
	rebuildConfig: {},
	makers: [
		new MakerSquirrel({
			name: electronConfig.id,
			description: electronConfig.description,
			exe: electronConfig.name,
			setupExe: electronConfig.id,
			setupIcon: electronConfig.icoIcon,
		}),
		new MakerDeb({
			options: {
				name: electronConfig.id,
				icon: electronConfig.pngIcon,
				categories: ['Office', 'Utility'],
				genericName: electronConfig.name,
				description: electronConfig.description,
				productName: electronConfig.name,
				productDescription: electronConfig.description,
				section: 'javascript',
			},
		}),
	],
	publishers: [
		{
			name: '@electron-forge/publisher-github',
			config: {
				repository: electronConfig.repository,
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
							js: './src/electron/preload.ts',
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
