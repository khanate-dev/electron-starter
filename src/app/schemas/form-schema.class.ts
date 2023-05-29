import { z } from 'zod';

import { humanizeToken } from '~/shared/helpers/string';
import { getCatchMessage } from '~/shared/errors';

import type {
	ZodDatetime,
	ZodDbId,
	ZodNumberSelection,
	ZodStringSelection,
} from '~/shared/helpers/schema';
import type { InputHTMLAttributes } from 'react';
import type { Utils } from '~/shared/types/utils';

export type FormSchemaLists<
	Zod extends z.ZodObject<Record<string, FormFieldZodType>, 'strict'>,
	Keys extends keyof Zod['shape'],
	WorkingObj extends {
		[K in Keys]: Zod['shape'][K] extends
			| BaseSelectionType
			| z.ZodNullable<BaseSelectionType>
			? z.infer<Zod['shape'][K]> | null
			: Zod['shape'][K] extends z.ZodNumber
			? string
			: z.infer<Zod['shape'][K]>;
	},
	Fields extends {
		[K in Keys]: FormSchemaField<Zod['shape'][K], WorkingObj>;
	}
> = Utils.filteredKeys<
	Fields,
	{ type: 'selection' } | { hasSuggestions: true }
> extends never
	? { lists?: never }
	: {
			/** the object containing option lists for dropdown element, if any */
			lists: {
				[K in Utils.filteredKeys<Fields, { type: 'selection' }>]: K extends Keys
					? App.DropdownOption<
							Zod['shape'][K] extends z.ZodArray<infer U, 'atleastone' | 'many'>
								? U extends BaseSelectionType
									? z.infer<U>
									: never
								: Exclude<z.infer<Zod['shape'][K]>, null>
					  >[]
					: never;
			} & {
				[K in Utils.filteredKeys<
					Fields,
					{ hasSuggestions: true }
				>]: K extends Keys
					? Fields[K]['type'] extends 'string'
						? string[]
						: number[]
					: never;
			};
	  };

type StringType = z.ZodString | z.ZodNullable<z.ZodString>;
type NumberType = z.ZodNumber | z.ZodNullable<z.ZodNumber>;
type DateType = ZodDatetime | z.ZodNullable<ZodDatetime>;
type BooleanType = z.ZodBoolean | z.ZodNullable<z.ZodBoolean>;
export type BaseSelectionType =
	| ZodDbId
	| z.ZodEnum<any>
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
	| BooleanType
	| z.AnyZodObject;

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
	isSortable?: boolean;

	/** can the field's value be null?  */
	notRequired?: boolean;
} & (T extends z.ZodNullable<any>
	? { notRequired: true }
	: T extends z.ZodArray<any>
	? { notRequired?: boolean }
	: { notRequired?: false });

type StringSchemaField<
	Zod extends StringType,
	WorkingObj extends Obj
> = AgnosticSchemaField<Zod> & {
	type: 'string';

	/** the inputProps to be passed to MUI TextField component */
	inputProps?:
		| ((state: WorkingObj) => InputHTMLAttributes<HTMLInputElement>)
		| InputHTMLAttributes<HTMLInputElement>;

	/** is the field secret. hides the content of the field by default. uses password type text field */
	isSecret?: boolean;

	/** does the input have a list of autocomplete suggestions? */
	hasSuggestions?: boolean;
};

type IntSchemaField<
	Zod extends NumberType,
	WorkingObj extends Obj
> = AgnosticSchemaField<Zod> & {
	type: 'int';

	/** the inputProps to be passed to MUI TextField component */
	inputProps?:
		| ((state: WorkingObj) => InputHTMLAttributes<HTMLInputElement>)
		| InputHTMLAttributes<HTMLInputElement>;

	/** does the input have a list of autocomplete suggestions? */
	hasSuggestions?: boolean;
};

type FloatSchemaField<
	Zod extends NumberType,
	WorkingObj extends Obj
> = AgnosticSchemaField<Zod> & {
	type: 'float';

	/** the inputProps to be passed to MUI TextField component */
	inputProps?:
		| ((state: WorkingObj) => InputHTMLAttributes<HTMLInputElement> & {
				step?: 'any' | number | `${number}`;
		  })
		| (InputHTMLAttributes<HTMLInputElement> & {
				step?: 'any' | number | `${number}`;
		  });

	/** does the input have a list of autocomplete suggestions? */
	hasSuggestions?: boolean;
};

export type SelectionSchemaField<
	Zod extends SelectionType,
	WorkingObj extends Obj,
	Type = Zod extends z.ZodArray<any>
		? z.infer<Zod>[number]
		: Exclude<z.infer<Zod>, null>,
	Options = Type extends App.DropdownType ? App.DropdownOption<Type> : never
> = AgnosticSchemaField<Zod> & {
	type: 'selection';

	/** does the dropdown allow multiple selections? */
	isMultiSelect?: boolean;

	/** function to filter the dropdown options */
	filter?: (options: Options[], state: WorkingObj) => Options[];
} & (Zod extends z.ZodArray<any, 'many' | 'atleastone'>
		? { isMultiSelect: true }
		: { isMultiSelect?: false });

type ReadonlySchemaField<Zod extends FormFieldZodType> = Omit<
	AgnosticSchemaField<Zod>,
	'isSortable'
> & { type: 'readonly' } & (Zod extends z.AnyZodObject | z.ZodArray<any>
		? { getValue: (row: z.infer<Zod>) => React.Node }
		: { getValue?: undefined });

type DateSchemaField<Zod extends DateType> = AgnosticSchemaField<Zod> & {
	type: 'date' | 'time' | 'datetime';
};

type BooleanSchemaField<Zod extends BooleanType> = AgnosticSchemaField<Zod> & {
	type: 'boolean';
};

export type FormSchemaField<
	Zod extends FormFieldZodType,
	WorkingObj extends Obj
> = Zod extends StringType
	? StringSchemaField<Zod, WorkingObj> | ReadonlySchemaField<Zod>
	: Zod extends SelectionType
	? Zod extends z.ZodEnum<any> | z.ZodNullable<z.ZodEnum<any>>
		? SelectionSchemaField<Zod, WorkingObj> | ReadonlySchemaField<Zod>
		: SelectionSchemaField<Zod, WorkingObj>
	: Zod extends NumberType
	?
			| IntSchemaField<Zod, WorkingObj>
			| FloatSchemaField<Zod, WorkingObj>
			| ReadonlySchemaField<Zod>
	: Zod extends DateType
	? DateSchemaField<Zod> | ReadonlySchemaField<Zod>
	: Zod extends BooleanType
	? BooleanSchemaField<Zod> | ReadonlySchemaField<Zod>
	: Zod extends z.AnyZodObject
	? ReadonlySchemaField<Zod>
	: never;

type FormSchemaConstructor<
	Zod extends z.ZodObject<Record<string, FormFieldZodType>, 'strict'>,
	Keys extends keyof Zod['shape'],
	WorkingObj extends {
		[K in Keys]: Zod['shape'][K] extends
			| BaseSelectionType
			| z.ZodNullable<BaseSelectionType>
			? z.infer<Zod['shape'][K]> | null
			: Zod['shape'][K] extends z.ZodNumber | z.ZodNullable<z.ZodNumber>
			? string
			: z.infer<Zod['shape'][K]>;
	},
	Fields extends {
		[K in Keys]: FormSchemaField<Zod['shape'][K], WorkingObj>;
	}
> = {
	/** schema's name */
	name: string;

	/** the label for the schema. the name is used if this is excluded */
	label?: string;

	/** the zod schema for the form */
	zod: Zod;

	/** list of schema fields */
	fields: Fields;
};

const transformSchema = <T extends z.ZodSchema, D extends boolean>(
	input: T,
	isDefault?: D
): D extends true ? z.ZodCatch<T> : T => {
	let zod;
	let def = null;
	if (input instanceof z.ZodString) {
		zod = input.trim();
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
			zod = unwrapped.trim().nullable();
			def = '';
		} else if (unwrapped instanceof z.ZodNumber) {
			const coerceSchema = isDefault
				? z.coerce.number().catch(0)
				: z.coerce.number();
			zod = z
				.preprocess((val) => coerceSchema.parse(val), unwrapped)
				.nullable();
			def = 0;
		} else {
			zod = input;
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
	Zod extends z.ZodObject<Record<string, FormFieldZodType>, 'strict'>,
	Keys extends keyof Zod['shape'],
	WorkingObj extends {
		[K in Keys]: Zod['shape'][K] extends
			| BaseSelectionType
			| z.ZodNullable<BaseSelectionType>
			? z.infer<Zod['shape'][K]> | null
			: Zod['shape'][K] extends z.ZodNumber | z.ZodNullable<z.ZodNumber>
			? string
			: z.infer<Zod['shape'][K]>;
	},
	Fields extends {
		[K in Keys]: FormSchemaField<Zod['shape'][K], WorkingObj>;
	}
> {
	/** schema's name */
	name: string;

	/** the label for the schema */
	label: string;

	/** the zod schema for the form */
	zod: Zod;

	/** list of schema fields */
	fields: {
		[K in Keys]: Fields[K] & {
			/** the name of the field */
			name: K;

			label: string;

			/** the zod schema for the field */
			zod: Zod['shape'][K];
		};
	};

	/** the schema's fields in an array */
	fieldsArray: (typeof this.fields)[Keys][];

	/** the zod schema to get the default state object */
	defaultZod: z.ZodObject<
		{ [K in Keys]: z.ZodCatch<Zod['shape'][K]> },
		'strip',
		z.ZodUndefined
	>;

	/** the default object for the schema */
	defaultValues: WorkingObj;

	constructor(schema: FormSchemaConstructor<Zod, Keys, WorkingObj, Fields>) {
		const zodObject = {} as Zod['shape'];
		const defaultZodObject = {} as { [K in Keys]: z.ZodCatch<Zod['shape'][K]> };
		this.name = schema.name;
		this.label = schema.label ?? humanizeToken(schema.name);
		this.fields = (
			Object.entries(schema.fields) as [Keys, (typeof schema.fields)[Keys]][]
		).reduce<typeof this.fields>((obj, [key, field]) => {
			try {
				const fz = schema.zod.shape[key] as unknown as Zod['shape'][Keys];
				const zod = transformSchema(fz);
				zodObject[key] = zod as Zod['shape'][Keys];
				defaultZodObject[key] = transformSchema(fz, true) as z.ZodCatch<
					Zod['shape'][Keys]
				>;

				obj[key] = {
					...field,
					name: key,
					label: field.label ?? humanizeToken(String(key)),
					zod,
				} as (typeof obj)[typeof key];

				if (
					field.type !== 'string' &&
					field.type !== 'int' &&
					field.type !== 'float'
				)
					return obj;

				let inputProps: undefined | InputHTMLAttributes<HTMLInputElement>;
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
				if (typeof field.inputProps === 'function') {
					const passed = field.inputProps;
					obj[key] = {
						...obj[key],
						inputProps: (state: WorkingObj) => {
							const returned = passed(state);
							return { ...returned, ...inputProps };
						},
					};
				} else {
					obj[key] = {
						...obj[key],
						inputProps: { ...field.inputProps, ...inputProps },
					};
				}
				return obj;
			} catch (error) {
				throw new Error(
					`invalid ${this.name} form schema: ${getCatchMessage(error)}`
				);
			}
		}, {} as typeof this.fields);
		this.fieldsArray = Object.values(this.fields);
		this.zod = z.strictObject(zodObject) as unknown as Zod;
		this.defaultZod = z.object(defaultZodObject).strip();
		this.defaultValues = this.defaultZod.parse({}) as WorkingObj;
	}
}
