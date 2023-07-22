import { isDayjs } from 'dayjs';
import { isValidElement } from 'react';
import { z } from 'zod';

import { dayjsFormatPatterns, dayjsUtc } from '~/shared/helpers/date';
import { omit } from '~/shared/helpers/object';

import type { GeneralTableColumn } from '~/app/components/tables/general-table';
import type { BulkResponse } from '~/app/helpers/api';
import type { App } from '~/app/types/app';

export const dbIdSchema = z.number().int().positive().finite().brand('DbKey');

export type ZodDbId = typeof dbIdSchema;

export const dayjsSchema = z.instanceof(
	dayjsUtc as unknown as typeof dayjsUtc.Dayjs,
);

export type ZodDayjs = typeof dayjsSchema;

export const datetimeSchema = z.preprocess((value) => {
	if (isDayjs(value)) return value;
	const parsed = dayjsUtc.utc(value as never);
	return parsed.isValid() ? parsed : null;
}, dayjsSchema);

export type ZodDatetime = typeof datetimeSchema;

export const imageUpdatedAtSchema = datetimeSchema.nullable();

export const timestampSchema = z.strictObject({
	createdAt: datetimeSchema,
	updatedAt: datetimeSchema,
});

export const stringSelectionSchema = z.string().brand('SelectionString');
export type ZodStringSelection = typeof stringSelectionSchema;
export type StringSelection = z.infer<ZodStringSelection>;

export const numberSelectionSchema = z.number().brand('SelectionNumber');
export type ZodNumberSelection = typeof numberSelectionSchema;
export type NumberSelection = z.infer<ZodNumberSelection>;

type OptionalGroup<T extends Record<string, unknown>> =
	| T
	| { [K in keyof T]?: never };

export const createGroupedOptionalSchema = <
	Schema extends z.ZodObject<any, any, any, any>,
>(
	schema: Schema,
): z.Schema<OptionalGroup<z.infer<Schema>>> => {
	return schema.or(
		z.object(
			Object.keys(schema.shape as Record<string, unknown>).reduce(
				(acc, key) => {
					acc[key] = z.undefined();
					return acc;
				},
				{} as Record<string, z.ZodUndefined>,
			),
		),
	);
};

export type DefaultBulkResponseObj = z.ZodObject<
	{},
	'strip',
	z.ZodUnknown,
	z.objectOutputType<{}, z.ZodUnknown, 'strip'>
>;

export const createBulkResponseSchema = <
	Schema extends z.ZodObject<any, any, any, any> = DefaultBulkResponseObj,
>(
	input?: Schema,
): z.Schema<BulkResponse<z.infer<Schema>>> => {
	const schema = input ?? z.object({}).catchall(z.unknown());
	const errorSchema = schema.extend({ error: z.string() });
	const bulkSchema = z.strictObject({
		successful: z.array(schema),
		failed: z.array(errorSchema),
	});
	return bulkSchema as z.Schema<BulkResponse<z.infer<Schema>>>;
};

export const dbDataSorter = <Type extends z.infer<typeof timestampSchema>>(
	a: Type,
	b: Type,
): number => b.createdAt.diff(a.createdAt);

export const createZodDbSchema = <
	Schema extends Record<string, z.ZodTypeAny>,
	Key extends keyof Schema,
>(
	schema: Schema,
	key: Key,
) => {
	const sansKeySchema = omit(schema, key);
	const sansMetaZodSchema = z.strictObject(sansKeySchema);
	const zodSchema = z.strictObject({
		...schema,
		...timestampSchema.shape,
	});
	return [sansMetaZodSchema, zodSchema] as const;
};

type Field = {
	name: string;
	label: string;
	type:
		| 'string'
		| 'readonly'
		| 'int'
		| 'float'
		| 'date'
		| 'time'
		| 'datetime'
		| 'selection'
		| 'boolean';
	zod: z.ZodSchema;
};

export const schemaToGeneralTableColumns = <T extends Record<string, Field>>(
	fields: T,
	lists?: {
		[K in keyof T as T[K]['type'] extends 'selection'
			? K
			: never]: App.dropdownOption<z.infer<T[K]['zod']>>[];
	},
) => {
	return Object.values(fields).map<
		GeneralTableColumn<Record<keyof T, unknown>>
	>((field) => ({
		id: field.name,
		headerContent: field.label,
		getBodyContent: (row) => {
			const value = row[field.name];
			if (isDayjs(value)) {
				if (!['date', 'time', 'datetime'].includes(field.type)) return '';
				return value.format(
					dayjsFormatPatterns[field.type as keyof typeof dayjsFormatPatterns],
				);
			}
			if (isValidElement(value)) return value;
			if (field.type !== 'selection') return String(value ?? '');
			const list = lists?.[field.name as keyof typeof lists] ?? [];
			return list.find((curr) => curr.value === value)?.label ?? '';
		},
		isSchemaField: true,
	}));
};
