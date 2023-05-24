import { isDayjs } from 'dayjs';
import { utils, writeFile } from 'xlsx';

import { addToast } from 'helpers/toast';

type Type =
	| 'string'
	| 'int'
	| 'float'
	| 'boolean'
	| 'date'
	| 'datetime'
	| 'time'
	| 'selection'
	| 'error'
	| 'readonly';

export const exportToExcel = <
	K extends string,
	Schema extends Record<K, { name: K; type: Type }>
>(
	schema: Schema,
	fileName: string,
	data?: Record<K, unknown>[]
) => {
	try {
		const getRow = (row?: Record<K, unknown>) => {
			const formatted = {} as Record<K, unknown>;
			for (const key in schema) {
				if (!Object.hasOwn(schema, key)) continue;
				const { name, type } = schema[key];
				let value = row?.[name];
				if (value === undefined || value === null) {
					value = '';
				} else if (type === 'date' || type === 'time' || type === 'datetime') {
					value =
						value instanceof Date
							? value
							: isDayjs(value)
							? value
							: typeof value === 'number' || typeof value === 'string'
							? new Date(value)
							: null;
				} else if (type === 'int' || type === 'float') {
					value = typeof value === 'number' ? value : null;
				} else {
					value = String(value);
				}
				formatted[name] = value;
			}
			return formatted;
		};
		const formattedData = data?.length ? data.map(getRow) : [getRow()];
		const workbook = utils.book_new();
		utils.book_append_sheet(workbook, utils.json_to_sheet(formattedData));
		writeFile(workbook, `${fileName}.xlsx`);
		addToast('Data Exported!', 'success');
	} catch (error) {
		addToast(error);
	}
};
