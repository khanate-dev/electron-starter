import { default as dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { datetimeSchema } from './schema.helpers';

import type { Dayjs } from 'dayjs';

dayjs.extend(utc);

export const dayjsUtc = dayjs;

export type DateLike = string | number | Dayjs | Date;

export const isDate = (value: unknown): value is DateLike => {
	return datetimeSchema.safeParse(value).success;
};

export const getDateOrNull = (value: unknown): null | Date => {
	const parsed = datetimeSchema.safeParse(value);
	if (!parsed.success) return null;
	return parsed.data.toDate();
};

export const compareDate = (first: DateLike, second: DateLike): number => {
	return dayjsUtc.utc(first).diff(second);
};

export const dayjsFormatPatterns = {
	date: 'YYYY-MM-DD',
	time: 'h:mm:ss A',
	datetime: 'YYYY-MM-DD h:mm A',
};
