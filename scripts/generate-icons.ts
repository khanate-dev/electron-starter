import { readFile, readdir, writeFile } from 'fs/promises';
import path from 'path';

import { parse } from 'node-html-parser';
import { optimize } from 'svgo';

const colors = {
	reset: '\x1b[0m',
	dim: '\x1b[2m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	blue: '\x1b[34m',
};

const sourceFolder = 'src/assets/icons';
const spritesPath = path.join(sourceFolder, 'sprites.svg');
const namesPath = path.join(sourceFolder, 'icon-names.ts');

const getIconDetails = async (folder: string = sourceFolder) => {
	const files = await readdir(folder, {
		withFileTypes: true,
		recursive: true,
	});
	const symbols: string[] = [];
	const names: string[] = [];

	for (const file of files) {
		const filePath = path.join(file.path, file.name);
		const name = file.name.replace(/\.svg$/u, '');
		if (
			!file.isFile() ||
			file.name === 'sprites.svg' ||
			!file.name.endsWith('.svg')
		)
			continue;
		if (names.includes(name)) {
			console.info(
				`${colors.dim}Duplicate icon: ${colors.red}${name}${colors.dim}${colors.reset}`,
			);
			continue;
		}

		const input = await readFile(filePath, 'utf-8');
		const optimized = optimize(input, {
			path: filePath,
			plugins: [
				{
					name: 'preset-default',
					params: { overrides: { removeViewBox: false } },
				},
				'reusePaths',
				'sortAttrs',
				'removeDimensions',
				{
					name: 'removeAttrs',
					params: { attrs: '*:(stroke|fill):((?!^none$).)*' },
				},
			],
		});
		await writeFile(filePath, optimized.data, 'utf-8');
		const root = parse(optimized.data);
		const svg = root.querySelector('svg');
		if (!svg) throw new Error('No SVG element found');
		svg.tagName = 'symbol';
		svg.setAttribute('id', name);
		['xmlns', 'xmlns:xlink', 'version', 'width', 'height'].forEach((attr) => {
			svg.removeAttribute(attr);
		});
		symbols.push(root.toString().trim());
		names.push(name);
	}

	return { symbols, names };
};

const generateIcons = async () => {
	const { symbols, names } = await getIconDetails();
	console.info(
		`${colors.dim}Found ${colors.green}${symbols.length}${colors.dim} icons...${colors.reset}`,
	);
	if (!symbols.length) return;

	const output = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0">`,
		`<defs>`,
		...symbols,
		`</defs>`,
		`</svg>`,
	].join('\n');

	const types = [
		'//? Auto-generated from the generate-icon script.',
		'//! DO NOT CHANGE MANUALLY!',
		'',
		'export const iconNames = [',
		names.map((name) => `\t'${name}',`).join('\n'),
		'] as const;',
		'',
		'export type IconName = (typeof iconNames)[number];',
		'',
	].join('\n');

	await Promise.all([
		writeFile(spritesPath, output, 'utf8'),
		writeFile(namesPath, types, 'utf8'),
	]);
	console.info(
		`${colors.dim}Created ${colors.green}${spritesPath}!${colors.reset}`,
	);
	console.info(
		`${colors.dim}Created ${colors.green}${namesPath}!${colors.reset}`,
	);
};

generateIcons();
