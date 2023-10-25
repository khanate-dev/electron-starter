import { backendPath } from '../app.config';
import { IMAGE_EXTENSIONS } from '../constants';

import type { Utils } from '../../shared/types/utils.types';
import type { App } from '../types/app.types';

/**
 * a function that throws an error if the given value is not a valid image
 * @param file the value to check
 * @throws {Error}
 */
export const assertValidImage: Utils.assertFunction<File> = (file) => {
	if (!(file instanceof File))
		throw new Error('invalid image: the given value is not a valid file');

	const validTypes = IMAGE_EXTENSIONS.map((type) =>
		type.replace('.', 'image/'),
	);
	if (!validTypes.includes(file.type)) {
		throw new Error(
			`invalid image: expected [${IMAGE_EXTENSIONS.join(
				', ',
			)}], received '${file.type.replace('image/', '.')}'`,
		);
	}

	if (file.size > 3000000)
		throw new Error('invalid image: file must be smaller than 3 MB');
};

/**
 * a function that returns true if the given value is a valid image
 * @param file the value to check
 * @returns {boolean}
 */
export const isValidImage = (file: unknown): file is File => {
	try {
		assertValidImage(file);
		return true;
	} catch {
		return false;
	}
};

export type GetImageUrlOpts = {
	table: string;
	id: App.dbId;
	version: number | null;
};

export const getImageUrl = ({
	table,
	id,
	version,
}: GetImageUrlOpts): string => {
	if (!version) return '';
	const url = new URL(`/images/${table.toLowerCase()}/${id}.png`, backendPath);
	url.searchParams.set('v', version.toString());
	return url.href;
};
