import { isDayjs } from 'dayjs';
import { isValidElement } from 'react';

import { dayjsFormatPatterns } from '~/shared/helpers/date.helpers';
import { humanizeToken } from '~/shared/helpers/humanize-token.helpers';

import type { z } from 'zod';
import type {
	FormSchema,
	FormSelectLists,
} from '~/app/classes/form-schema.class';
import type { GeneralTableColumn } from '~/app/components/tables/general-table.component';
import type {
	ViewColumnKey,
	ViewColumnType,
	ViewColumns,
} from '~/app/components/tables/view-table.component';

export const getViewColumnValue = (
	data: Obj,
	key: string,
	type: ViewColumnType,
) => {
	const value = data[key];
	if (typeof type === 'function') return type(data);
	switch (type) {
		case 'boolean': {
			return data[key] ? 'Yes' : 'No';
		}
		case 'date':
		case 'time':
		case 'datetime': {
			return isDayjs(value) ? value.format(dayjsFormatPatterns[type]) : '';
		}
		case 'int':
		case 'float': {
			return typeof value === 'number'
				? value.toFixed(type === 'int' ? 0 : 2)
				: '';
		}
		case 'string': {
			return typeof value === 'string' ? value : '';
		}
		default:
			throw new Error('invalid field type');
	}
};

export const createViewColumns = <
	T extends z.AnyZodObject,
	Cols extends ViewColumnKey<T['_output']>,
>(input: {
	schema: T;
	columns: ViewColumns<T['_output'], Cols>;
}) => {
	return input.columns;
};

export const viewToGeneralTableColumns = <
	T extends Obj,
	Cols extends ViewColumnKey<T>,
>(
	columns: ViewColumns<T, Cols>,
) => {
	return Object.entries(columns).map<GeneralTableColumn<T>>(([key, type]) => ({
		name: key,
		header: humanizeToken(key),
		getCell: (row) => getViewColumnValue(row, key, type as never),
		sortable: true,
		align: type === 'int' || type === 'float' ? 'right' : 'left',
	}));
};

export const formSchemaToGeneralTableColumns = <T extends FormSchema>(
	...args: [FormSelectLists<T, true>['selectionLists']] extends [never]
		? [schema: T]
		: [schema: T, lists: FormSelectLists<T, true>['selectionLists']]
): GeneralTableColumn<Obj>[] => {
	const [schema, lists] = args;
	return schema.fieldsArray.map<GeneralTableColumn<Obj>>((field) => ({
		name: field.name,
		header: field.label,
		getCell: (row) => {
			const value = row[field.name];
			if (isDayjs(value)) {
				if (!['date', 'time', 'datetime'].includes(field.type)) return '';
				return value.format(
					dayjsFormatPatterns[field.type as keyof typeof dayjsFormatPatterns],
				);
			}
			if (isValidElement(value)) return value;
			if (field.type !== 'selection') return String(value ?? '');
			const listOpt = lists?.[field.name as keyof typeof lists] ?? [];
			const list =
				typeof listOpt === 'function'
					? listOpt(row as never)
					: (listOpt as undefined | { value: unknown; label: string }[]) ?? [];
			return list.find((curr) => curr.value === value)?.label ?? '';
		},
	}));
};
