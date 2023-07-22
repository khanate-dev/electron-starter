import { humanizeToken } from '~/shared/helpers/string';

import type { z } from 'zod';
import type { ZodDatetime, ZodDbId } from '~/shared/helpers/schema';
import type { Utils } from '~/shared/types/utils';

export type ViewFieldZodType =
	| z.ZodString
	| z.ZodEnum<any>
	| z.ZodNumber
	| ZodDbId
	| ZodDatetime
	| z.AnyZodObject
	| z.ZodBoolean
	| z.ZodNullable<
			| z.ZodString
			| z.ZodEnum<any>
			| z.ZodNumber
			| ZodDbId
			| ZodDatetime
			| z.AnyZodObject
			| z.ZodBoolean
	  >;

export type ViewSchemaField<T extends ViewFieldZodType> = {
	/** the type of the schema field */
	type: unknown;

	/** label of the field */
	label?: string;
} & (T extends
	| z.ZodString
	| z.ZodEnum<any>
	| z.ZodNullable<z.ZodString | z.ZodEnum<any>>
	? { type: 'string' }
	: T extends ZodDbId | z.ZodNullable<ZodDbId>
	? { type: 'int' }
	: T extends z.ZodNumber | z.ZodNullable<z.ZodNumber>
	? { type: 'int' | 'float' }
	: T extends ZodDatetime | z.ZodNullable<ZodDatetime>
	? { type: 'date' | 'time' | 'datetime' }
	: T extends z.ZodBoolean | z.ZodNullable<z.ZodBoolean>
	? { type: 'boolean' }
	: never);

type ViewSchemaConstructor<
	Zod extends z.AnyZodObject,
	Fields extends {
		[K in keyof Zod['shape']]?: ViewSchemaField<Zod['shape'][K]>;
	},
	PK extends keyof Zod['shape'],
	ID extends keyof Zod['shape'],
> = {
	/** schema's name */
	name: string;

	/** the label for the schema. the name is used if this is excluded */
	label?: string;

	/** the zod validation schema for the view list */
	zod: Zod;

	/** the primary key field */
	primaryKey: PK;

	/** the column that uniquely identify schema rows */
	identifier: ID;

	/** list of schema fields */
	fields: Fields;
} & ('imageUpdatedAt' extends keyof Zod['shape']
	? { image: true }
	: { image?: undefined });

export class ViewSchema<
	Zod extends z.AnyZodObject,
	Fields extends {
		[K in Utils.filteredKeys<Zod['shape'], ViewFieldZodType>]?: ViewSchemaField<
			Zod['shape'][K]
		>;
	},
	PK extends keyof Zod['shape'],
	ID extends keyof Zod['shape'],
> {
	/** schema's name */
	name: string;

	/** the label for the schema. the name is used if this is excluded */
	label: string;

	/** the zod validation schema for the view list */
	zod: Zod;

	/** the primary key field */
	primaryKey: PK;

	/** the column that uniquely identify schema rows */
	identifier: ID;

	/** does the view have an image? */
	image: 'imageUpdatedAt' extends keyof Zod['shape'] ? true : false;

	/** list of schema fields */
	fields: {
		[K in keyof Fields]: Fields[K] & {
			/** the name of the field */
			name: K;

			label: string;

			/** the zod schema for the field */
			zod: Zod['shape'][K];
		};
	};

	/** the schema's fields in an array */
	fieldsArray: (typeof this.fields)[keyof typeof this.fields][];

	constructor(schema: ViewSchemaConstructor<Zod, Fields, PK, ID>) {
		this.name = schema.name;
		this.label = schema.label ?? humanizeToken(schema.name);
		this.zod = schema.zod;
		this.primaryKey = schema.primaryKey;
		this.identifier = schema.identifier;
		this.image = Boolean(schema.image) as typeof this.image;
		this.fields = (
			Object.entries(schema.fields) as [keyof Fields, Fields[keyof Fields]][]
		).reduce<typeof this.fields>(
			(obj, [key, field]) => ({
				...obj,
				[key]: {
					...field,
					name: key,
					label: field?.label ?? humanizeToken(String(key)),
					zod: (this.zod.shape as Record<keyof Fields, z.ZodSchema>)[key],
				},
			}),
			{} as typeof this.fields,
		);
		this.fieldsArray = Object.values(this.fields);
	}
}
