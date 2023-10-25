import { isDayjs } from 'dayjs';
import { z } from 'zod';

import { dayjsUtc } from './date.helpers';
import { omit } from './object.helpers';

import type { Utils } from '../../shared/types/utils.types';
import type { BulkResponse } from './api.helpers';

export const dbIdSchema = z.number().int().positive().finite().brand('DbId');
export type ZodDbId = typeof dbIdSchema;

export const stringSelectionSchema = z.string().brand('SelectionString');
export type ZodStringSelection = typeof stringSelectionSchema;

export const numberSelectionSchema = z.number().brand('SelectionNumber');
export type ZodNumberSelection = typeof numberSelectionSchema;

export const dropdownTypeSchema = dbIdSchema
	.or(stringSelectionSchema)
	.or(numberSelectionSchema);
export type ZodDropdownType = typeof dropdownTypeSchema;

export const dropdownOptionSchema = z.strictObject({
	value: dropdownTypeSchema,
	label: z.string(),
});
export type ZodDropdownOption = typeof dropdownOptionSchema;

export const localIdSchema = z
	.number()
	.int()
	.positive()
	.finite()
	.brand('_localId');
export type ZodLocalId = typeof localIdSchema;

export const dayjsSchema = z.instanceof(
	dayjsUtc as unknown as typeof dayjsUtc.Dayjs,
);

export type ZodDayjs = typeof dayjsSchema;

export const datetimeSchema = z.preprocess((value) => {
	if (isDayjs(value)) return value;
	if (value === undefined || value === null) return null;
	const parsed = dayjsUtc.utc(value as never);
	return parsed.isValid() ? parsed : null;
}, dayjsSchema);

export type ZodDatetime = typeof datetimeSchema;

export const imageVersionSchema = z.number().int().positive().nullable();

export const metaSchema = z.strictObject({
	CreatedAt: datetimeSchema,
	UpdatedAt: datetimeSchema,
	CreatedBy: dbIdSchema.nullable(),
	UpdatedBy: dbIdSchema.nullable(),
});

export const jwtSchema = z
	.string()
	.regex(/^[0-9a-zA-Z]*\.[0-9a-zA-Z]*\.[0-9a-zA-Z-_]*$/u);

export const zodAllOrNone = <T extends Record<string, z.Schema>>(
	shape: T,
): z.Schema<
	Utils.allOrNone<
		Utils.makeUndefinedOptional<{ [k in keyof T]: T[k]['_output'] }>
	>
> => {
	return z.strictObject(shape).or(
		z.object(
			Object.keys(shape).reduce(
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
	Schema extends z.ZodObject<z.ZodRawShape> = DefaultBulkResponseObj,
>(
	input?: Schema,
): z.Schema<BulkResponse<Schema['_output']>> => {
	const schema = input ?? z.object({}).catchall(z.unknown());
	const errorSchema = schema.extend({ error: z.string() });
	const bulkSchema = z.strictObject({
		successful: z.array(schema),
		failed: z.array(errorSchema),
	});
	return bulkSchema as z.Schema<BulkResponse<Schema['_output']>>;
};

export const dbDataSorter = <Type extends (typeof metaSchema)['_output']>(
	a: Type,
	b: Type,
): number => b.CreatedAt.diff(a.CreatedAt);

export const createZodDbSchema = <
	Schema extends Record<string, z.ZodTypeAny>,
	Key extends keyof Schema,
>(
	schema: Schema,
	key: Key,
) => {
	const sansKeySchema = omit(schema, key);
	const sansMetaSchema = z.strictObject(sansKeySchema);
	const zodSchema = z.strictObject({
		...schema,
		...metaSchema.shape,
	});
	return [sansMetaSchema, zodSchema] as const;
};
