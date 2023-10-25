import { z } from 'zod';

import { stringifyError } from '../errors';
import { humanizeToken } from '../helpers/humanize-token.helpers';

import type { ComponentPropsWithoutRef } from 'react';
import type { Utils } from '../../shared/types/utils.types';
import type {
	ZodDatetime,
	ZodDbId,
	ZodNumberSelection,
	ZodStringSelection,
} from '../helpers/schema.helpers';
import type { App } from '../types/app.types';

export type FormZod = z.ZodObject<Record<string, FormFieldZodType>, 'strict'>;

export type FormWorkingObj<T extends FormSchema> = {
	[K in keyof T['fields']]: T['fields'][K] extends {
		type: 'selection';
		isMultiSelect?: false;
	}
		? T['fields'][K]['zod']['_output'] | null
		: T['fields'][K]['type'] extends 'int' | 'float'
		? string
		: T['fields'][K]['zod']['_output'];
};

export type FormFields<Zod extends FormZod> = {
	[K in keyof Zod['shape']]: FormSchemaField<Zod['shape'][K]>;
};

export type FormSelectType<T extends z.ZodSchema> = T extends
	| z.ZodArray<infer U>
	| z.ZodNullable<infer U>
	? U extends BaseSelectionType
		? U['_output']
		: never
	: T extends infer U
	? U extends BaseSelectionType
		? U['_output']
		: never
	: never;

export type FormSelectLists<
	T extends FormSchema,
	IsMultiForm extends boolean = false,
> = [Utils.filteredKeys<T['fields'], { type: 'selection' }>] extends [never]
	? { selectionLists?: never }
	: {
			/** the object containing option lists for selection fields */
			selectionLists: {
				[K in keyof T['fields'] as T['fields'][K]['type'] extends 'selection'
					? K
					: never]:
					| (IsMultiForm extends true
							? (
									row: FormWorkingObj<T>,
							  ) => App.dropdownOption<FormSelectType<T['fields'][K]['zod']>>[]
							: never)
					| App.dropdownOption<FormSelectType<T['fields'][K]['zod']>>[];
			};
	  };

export type FormSuggestLists<T extends FormSchema> = [
	Utils.filteredKeys<T['fields'], { hasSuggestions: true }>,
] extends [never]
	? { suggestionLists?: never }
	: {
			/** the object containing option lists for input fields with suggestions */
			suggestionLists: {
				[K in keyof T['fields'] as K extends Utils.filteredKeys<
					T['fields'],
					{ hasSuggestions: true }
				>
					? K
					: never]: T['fields'][K]['type'] extends 'string'
					? string[]
					: number[];
			};
	  };

type StringType = z.ZodString | z.ZodNullable<z.ZodString>;
type NumberType = z.ZodNumber | z.ZodNullable<z.ZodNumber>;
type DateType = ZodDatetime | z.ZodNullable<ZodDatetime>;
type BooleanType = z.ZodBoolean | z.ZodNullable<z.ZodBoolean>;
export type BaseSelectionType =
	| ZodDbId
	| z.ZodEnum<[string, ...string[]]>
	| ZodStringSelection
	| ZodNumberSelection;

type SelectionType =
	| BaseSelectionType
	| z.ZodNullable<BaseSelectionType>
	| z.ZodArray<BaseSelectionType>;

export type FormFieldZodType =
	| SelectionType
	| StringType
	| NumberType
	| DateType
	| BooleanType;

type AgnosticSchemaField<T extends FormFieldZodType> = {
	/** the type of the schema field */
	type: unknown;

	/** label of the field */
	label?: string;

	/** the name of the import column for this field */
	importName?: string;

	/** is this field unavailable in update form? */
	noUpdate?: boolean;

	/** is the field unavailable for import? */
	noImport?: boolean;

	/** should schema's tables be sortable by this field? */
	sortable?: boolean;

	/** can the field's value be null?  */
	notRequired?: boolean;
} & (T extends z.ZodNullable<z.ZodTypeAny>
	? { notRequired: true }
	: T extends z.ZodArray<z.ZodTypeAny>
	? { notRequired?: boolean }
	: { notRequired?: false });

type StringSchemaField<Zod extends StringType> = AgnosticSchemaField<Zod> & {
	type: 'string';

	/** the inputProps to be passed to MUI TextField component */
	inputProps?: ComponentPropsWithoutRef<'input'>;

	/** is the field secret. hides the content of the field by default. uses password type text field */
	isSecret?: boolean;

	/** does the input have a list of autocomplete suggestions? */
	hasSuggestions?: boolean;
};

type NumberSchemaField<Zod extends NumberType> = AgnosticSchemaField<Zod> & {
	type: 'int' | 'float';

	/** the inputProps to be passed to MUI TextField component */
	inputProps?: ComponentPropsWithoutRef<'input'>;

	/** does the input have a list of autocomplete suggestions? */
	hasSuggestions?: boolean;
};

export type SelectionSchemaField<Zod extends SelectionType> =
	AgnosticSchemaField<Zod> & {
		type: 'selection';

		/** does the dropdown allow multiple selections? */
		isMultiSelect?: boolean;
	} & (Zod extends z.ZodArray<z.ZodTypeAny, z.ArrayCardinality>
			? { isMultiSelect: true }
			: { isMultiSelect?: false });

type ReadonlySchemaField<Zod extends FormFieldZodType> = Omit<
	AgnosticSchemaField<Zod>,
	'sortable'
> & { type: 'readonly' };

type DateSchemaField<Zod extends DateType> = AgnosticSchemaField<Zod> & {
	type: 'date' | 'time' | 'datetime';
};

type BooleanSchemaField<Zod extends BooleanType> = AgnosticSchemaField<Zod> & {
	type: 'boolean';
};

export type FormSchemaField<Zod extends FormFieldZodType> =
	Zod extends StringType
		? StringSchemaField<Zod> | ReadonlySchemaField<Zod>
		: Zod extends SelectionType
		? SelectionSchemaField<Zod> | ReadonlySchemaField<Zod>
		: Zod extends NumberType
		? NumberSchemaField<Zod> | ReadonlySchemaField<Zod>
		: Zod extends DateType
		? DateSchemaField<Zod> | ReadonlySchemaField<Zod>
		: Zod extends BooleanType
		? BooleanSchemaField<Zod> | ReadonlySchemaField<Zod>
		: never;

type FormSchemaConstructor<
	Zod extends FormZod,
	Fields extends FormFields<Zod>,
> = {
	/** schema's name */
	name: string;

	/** the label for the schema. the name is used if this is excluded */
	label?: string;

	/** the zod schema for the form */
	zod: Zod;

	/** list of schema fields */
	fields: {
		[k in keyof Fields]: k extends keyof Zod['shape']
			? k extends Utils.filteredKeys<Zod['shape'], FormFieldZodType>
				? Fields[k] extends FormSchemaField<Zod['shape'][k]>
					? Fields[k]
					: never
				: never
			: never;
	};
};

const transformSchema = <T extends z.ZodSchema, D extends boolean>(
	input: T,
	isDefault?: D,
): D extends true ? z.ZodCatch<T> : T => {
	let zod;
	let def = null;
	if (input instanceof z.ZodString) {
		zod = z.preprocess((val) => String(val ?? ''), input.trim());
		def = '';
	} else if (input instanceof z.ZodNumber) {
		const coerceSchema = isDefault
			? z.coerce.number().catch(0)
			: z.coerce.number();
		zod = z.preprocess((val) => coerceSchema.parse(val), input);
		def = 0;
	} else if (input instanceof z.ZodNullable) {
		const unwrapped = input.unwrap() as z.ZodSchema;
		if (unwrapped instanceof z.ZodString) {
			zod = z.preprocess(
				(val) =>
					isDefault
						? val
						: val === null || val === undefined || val === ''
						? null
						: String(val),
				unwrapped.trim().nullable(),
			);
			def = '';
		} else if (unwrapped instanceof z.ZodNumber) {
			const coerceSchema = isDefault
				? z.coerce.number().catch(0)
				: z.coerce.number();
			zod = z.preprocess(
				(val) => (val === '' ? null : coerceSchema.parse(val)),
				input,
			);
			def = 0;
		} else {
			zod = z.preprocess((val) => val ?? null, input);
			if (unwrapped instanceof z.ZodBoolean) def = false;
		}
	} else {
		zod = input;
		if (input instanceof z.ZodBoolean) def = false;
		else if (input instanceof z.ZodArray) def = [];
	}
	if (!isDefault) return zod as never;
	return (zod as z.ZodSchema).catch(def) as never;
};

export class FormSchema<
	Zod extends FormZod = FormZod,
	Fields extends FormFields<Zod> = FormFields<Zod>,
> {
	/** schema's name */
	name: string;

	/** the label for the schema */
	label: string;

	/** the zod schema for the form */
	zod: Zod;

	/** list of schema fields */
	fields: {
		[K in keyof Zod['shape']]: Fields[K] & {
			/** the name of the field */
			name: K;

			label: string;

			/** the zod schema for the field */
			zod: Zod['shape'][K];
		};
	};

	/** the schema's fields in an array */
	fieldsArray: (typeof this.fields)[keyof Zod['shape']][];

	/** the zod schema to get the default state object */
	defaultZod: z.ZodObject<
		{ [K in keyof Zod['shape']]: z.ZodCatch<Zod['shape'][K]> },
		'strip',
		z.ZodUndefined
	>;

	/** the default object for the schema */
	defaultValues: {
		[K in keyof Zod['shape']]: Fields[K] extends {
			type: 'selection';
			isMultiSelect?: false;
		}
			? Zod['shape'][K]['_output'] | null
			: Fields[K]['type'] extends 'int' | 'float'
			? string
			: Zod['shape'][K]['_output'];
	};

	constructor(schema: FormSchemaConstructor<Zod, Fields>) {
		const zodObject = {} as Zod['shape'];
		const defaultZodObject = {} as {
			[K in keyof Zod['shape']]: z.ZodCatch<Zod['shape'][K]>;
		};
		this.name = schema.name;
		this.label = schema.label ?? humanizeToken(schema.name);
		this.fields = (
			Object.entries(schema.fields) as [
				keyof Zod['shape'],
				Fields[keyof Fields],
			][]
		).reduce<typeof this.fields>(
			(obj, [key, field]) => {
				try {
					const fz = schema.zod.shape[
						key
					] as unknown as Zod['shape'][keyof Zod['shape']];
					const zod = transformSchema(fz);
					zodObject[key] = zod as Zod['shape'][keyof Zod['shape']];
					defaultZodObject[key] = transformSchema(fz, true) as z.ZodCatch<
						Zod['shape'][keyof Zod['shape']]
					>;

					obj[key] = {
						...field,
						name: key,
						label:
							field.label ??
							humanizeToken(String(key)).replace(/(.+)ID$/u, '$1'),
						zod,
					} as never;

					if (
						field.type !== 'string' &&
						field.type !== 'int' &&
						field.type !== 'float'
					)
						return obj;

					let inputProps: undefined | ComponentPropsWithoutRef<'input'>;
					switch (field.type) {
						case 'string': {
							let minLength = undefined;
							let maxLength = undefined;
							if (fz instanceof z.ZodString) {
								minLength = fz.minLength ?? undefined;
								maxLength = fz.maxLength ?? undefined;
							} else if (fz instanceof z.ZodNullable) {
								const inner = fz.unwrap();
								if (!(inner instanceof z.ZodString))
									throw new Error(`${key.toString()} must be a string schema`);
								minLength = inner.minLength ?? undefined;
								maxLength = inner.maxLength ?? undefined;
								if (minLength !== undefined || maxLength !== undefined)
									inputProps = { min: minLength, max: maxLength };
							} else {
								throw new Error(`${key.toString()} must be a string schema`);
							}
							if (minLength !== undefined || maxLength !== undefined)
								inputProps = { minLength, maxLength };
							break;
						}
						default: {
							let min = undefined;
							let max = undefined;
							if (fz instanceof z.ZodNumber) {
								min = fz.minValue ?? undefined;
								max = fz.maxValue ?? undefined;
							} else if (fz instanceof z.ZodNullable) {
								const inner = fz.unwrap();
								if (!(inner instanceof z.ZodNumber))
									throw new Error(`${key.toString()} must be a number schema`);
								min = inner.minValue ?? undefined;
								max = inner.maxValue ?? undefined;
								if (min !== undefined || max !== undefined)
									inputProps = { min, max };
							} else {
								throw new Error(`${key.toString()} must be a number schema`);
							}
							if (min !== undefined || max !== undefined)
								inputProps = { min, max };
							break;
						}
					}
					if (!inputProps) return obj;
					obj[key] = {
						...obj[key],
						inputProps: { ...field.inputProps, ...inputProps },
					};
					return obj;
				} catch (error) {
					throw new Error(
						`invalid ${this.name} form schema: ${stringifyError(error)}`,
					);
				}
			},
			{} as typeof this.fields,
		);
		this.fieldsArray = Object.values(this.fields) as never;
		this.zod = z.strictObject(zodObject) as unknown as Zod;
		this.defaultZod = z.object(defaultZodObject).strip();
		this.defaultValues = Object.entries(this.defaultZod.parse({})).reduce<
			typeof this.defaultValues
		>(
			(obj, [key, value]) => {
				return {
					...obj,
					[key]:
						typeof value === 'number' ? value.toString() : (value as never),
				};
			},
			{} as typeof this.defaultValues,
		);
	}
}
