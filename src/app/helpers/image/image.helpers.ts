import { IMAGE_EXTENSIONS, apiEndpoint } from '~/app/config';

import type { Dayjs } from 'dayjs';
import type { Utils } from '~/shared/types/utils';

/**
 * a function that throws an error if the given value is not a valid image
 * @param file the value to check
 * @throws {Error}
 */
export const assertValidImage: Utils.assertFunction<File> = (file) => {
	if (!(file instanceof File))
		throw new Error('invalid image: the given value is not a valid file');

	const validTypes = IMAGE_EXTENSIONS.map((type) =>
		type.replace('.', 'image/')
	);
	if (!validTypes.includes(file.type)) {
		throw new Error(
			`invalid image: expected [${IMAGE_EXTENSIONS.join(
				', '
			)}], received '${file.type.replace('image/', '.')}'`
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

/**
 * returns the url to request for the image for the given record
 * @param table the name of the database table to request for
 * @param identifier the value of the `identifier` key of the record
 * @param updatedAt the value of the `imageUpdatedAt` key of the record
 */
export const getImageUrl = (
	table: string,
	identifier: string,
	updatedAt: Dayjs | null
): string => {
	if (!updatedAt) return '';
	const url = new URL(`/images/${table}/${identifier}.png`, apiEndpoint);
	url.searchParams.set('timeStamp', updatedAt.toISOString());
	return url.href;
};
