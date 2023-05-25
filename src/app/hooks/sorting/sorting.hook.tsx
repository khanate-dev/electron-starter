import { useState } from 'react';

import { compareDate, isDate } from '~/shared/helpers/date';

export type Sorting<T extends PropertyKey> = {
	column: T | null;
	direction: 'ascending' | 'descending';
};

export const useSorting = <Type extends Obj, Keys extends keyof Type>(
	data: Type[],
	isDisabled?: boolean,
	defaultSorting: Sorting<Keys> = { column: null, direction: 'descending' }
) => {
	const [sorting, setSorting] = useState<Sorting<Keys>>(defaultSorting);

	const { column, direction } = sorting;

	const updateSorting = (col: Keys) => {
		setSorting((prev) => ({
			column: col,
			direction:
				col === prev.column && prev.direction === 'descending'
					? 'ascending'
					: 'descending',
		}));
	};

	if (isDisabled) {
		return {
			sorting: defaultSorting,
			updateSorting: () => false,
			sortedData: data,
		};
	}

	if (
		column &&
		data.length &&
		sorting !== defaultSorting &&
		data.every((object) => !Object.hasOwn(object, column))
	)
		setSorting(defaultSorting);

	const sortedData = data.slice();

	if (data.length > 0 && column) {
		sortedData.sort((a, b) => {
			const isAscending = direction === 'ascending';
			const first: any = (isAscending ? a : b)[column];
			const second: any = (isAscending ? b : a)[column];

			if (isDate(first) && isDate(second)) return compareDate(first, second);

			if (typeof first === 'string' && typeof second === 'string')
				return first.toString().localeCompare(second);

			return first - second;
		});
	}

	return {
		sorting,
		updateSorting,
		sortedData,
	};
};
