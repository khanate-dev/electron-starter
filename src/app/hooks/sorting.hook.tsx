import { isDayjs } from 'dayjs';
import { useState } from 'react';

import type { GeneralTableColumn } from '~/app/components/tables/general-table.component';

export type SortDirection = 'ascending' | 'descending';

export type Sorting<T extends Obj> = {
	column: GeneralTableColumn<T> | null;
	direction: SortDirection;
};

export const useSorting = <T extends Obj>(
	data: T[],
	isDisabled?: boolean,
	defaultSorting?: Sorting<T>,
) => {
	const [sorting, setSorting] = useState<Sorting<T>>(
		defaultSorting ?? { column: null, direction: 'descending' },
	);

	const { column, direction } = sorting;

	const updateSorting = (col: GeneralTableColumn<T>) => {
		setSorting((prev) => ({
			column:
				col === prev.column && prev.direction === 'ascending' ? null : col,
			direction:
				col === prev.column && prev.direction === 'descending'
					? 'ascending'
					: 'descending',
		}));
	};

	if (isDisabled) {
		return {
			sorting,
			updateSorting: () => false,
			sortedData: data,
		};
	}

	const sortedData = data.slice();

	if (data.length > 0 && column) {
		sortedData.sort((a, b) => {
			const isAscending = direction === 'ascending';
			const aVal: unknown =
				a[column.name] ?? column.getCell(a, data.indexOf(a))?.toString() ?? '';
			const bVal: unknown =
				b[column.name] ?? column.getCell(b, data.indexOf(b))?.toString() ?? '';
			const first = isAscending ? aVal : bVal;
			const second = isAscending ? bVal : aVal;

			if (typeof first === 'number' && typeof second === 'number')
				return first - second;

			if (isDayjs(a) && isDayjs(b)) return a.diff(b);

			return String(first).localeCompare(String(second));
		});
	}

	return {
		sorting,
		updateSorting,
		sortedData,
	};
};
