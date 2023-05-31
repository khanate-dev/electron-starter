import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';

import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';

import { electronConfig } from './src/electron/config';
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

import type { ForgeConfig } from '@electron-forge/shared-types';

const config: ForgeConfig = {
	packagerConfig: {
		icon: electronConfig.icoIcon,
		name: electronConfig.id,
		executableName: electronConfig.id,
		asar: true,
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
		new AutoUnpackNativesPlugin({}),
	],
	// ? https://github.com/serialport/node-serialport/issues/2464#issuecomment-1516887882
	hooks: {
		packageAfterPrune: async (_, buildPath, __, platform) => {
			return new Promise((resolve, reject) => {
				const oldPackageJson = path.join(buildPath, 'package.json');
				const newPackageJson = path.join(buildPath, '_package.json');

				fs.renameSync(oldPackageJson, newPackageJson);

				const args = [
					'install',
					'--no-package-lock',
					'--no-save',
					'serialport',
				];
				const npmInstall = spawn('npm', args, {
					cwd: buildPath,
					stdio: 'inherit',
					shell: true,
				});

				npmInstall.on('close', (code) => {
					if (code === 0) {
						fs.renameSync(newPackageJson, oldPackageJson);

						/**
						 * On windows code signing fails for ARM binaries etc.,
						 * we remove them here
						 */
						if (platform === 'win32') {
							const problematicPaths = [
								'android-arm',
								'android-arm64',
								'darwin-x64+arm64',
								'linux-arm',
								'linux-arm64',
								'linux-x64',
							];

							problematicPaths.forEach((binaryFolder) => {
								fs.rmSync(
									path.join(
										buildPath,
										'node_modules',
										'@serialport',
										'bindings-cpp',
										'prebuilds',
										binaryFolder
									),
									{ recursive: true, force: true }
								);
							});
						}

						resolve();
					} else {
						reject(
							new Error(`process finished with error code ${code ?? 'null'}`)
						);
					}
				});

				npmInstall.on('error', (error) => {
					reject(error);
				});
			});
		},
	},
};

// eslint-disable-next-line import/no-default-export
export default config;
