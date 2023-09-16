import { isDayjs } from 'dayjs';

import { FormCheckbox } from '~/app/components/forms/form-checkbox.component';
import { FormDropdown } from '~/app/components/forms/form-dropdown.component';
import { FormPicker } from '~/app/components/forms/form-picker.component';
import { FormReadonly } from '~/app/components/forms/form-readonly.component';
import { FormTextfield } from '~/app/components/forms/form-textfield.component';

import type { TextFieldProps } from '@mui/material';
import type {
	FormFieldZodType,
	FormSchemaField,
} from '~/app/classes/form-schema.class';
import type { App } from '~/app/types/app.types';
import type { Mui } from '~/app/types/mui.types';

export type FormFieldProps<
	Type extends FormFieldZodType,
	WorkingObj extends Obj,
	ObjKeys extends keyof WorkingObj,
	Field extends FormSchemaField<Type>,
	Name extends ObjKeys,
> = Mui.propsWithSx<
	{
		/** the current schema field */
		field: Field & {
			/** the name of the field */
			name: ObjKeys;

			label: string;

			/** the zod schema for the field */
			zod: Type;
		};

		/** the current form values */
		formValues: WorkingObj;

		/** the callback function for form field change event */
		onChange: (value: unknown) => void;

		/** the size of the form field */
		size?: TextFieldProps['size'];

		/** should labels be shown on form fields? */
		noLabel?: boolean;

		/** should the form field be disabled? */
		disabled?: boolean;
	} & (Field['type'] extends 'selection'
		? {
				/** the object containing the lists for dropdown fields */
				options: Exclude<WorkingObj[Name], null> extends App.dropdownType
					? App.dropdownOption<Exclude<WorkingObj[Name], null>>[]
					: never;
		  }
		: Field extends { hasSuggestions: true }
		? {
				/** the object containing the lists for dropdown fields */
				options: Field['type'] extends 'string' ? string[] : number[];
		  }
		: {
				options?: undefined;
		  })
>;

export const FormField = <
	Type extends FormFieldZodType,
	WorkingObj extends Obj,
	ObjKeys extends keyof WorkingObj,
	Field extends FormSchemaField<Type>,
	Name extends ObjKeys,
>({
	sx,
	field,
	formValues,
	options: passedOptions,
	onChange,
	size,
	noLabel,
	disabled,
}: FormFieldProps<Type, WorkingObj, ObjKeys, Field, Name>) => {
	const componentProps = {
		size,
		sx,
		label: !noLabel ? field.label : undefined,
	};

	const required = field.type !== 'readonly' && !field.notRequired;
	const value = formValues[field.name];
	const options =
		field.type === 'selection'
			? passedOptions ?? []
			: (field.type === 'int' ||
					field.type === 'string' ||
					field.type === 'float') &&
			  field.hasSuggestions
			? passedOptions ?? []
			: [];

	switch (field.type) {
		case 'readonly':
			return (
				<FormReadonly
					{...componentProps}
					value={value}
				/>
			);
		case 'boolean':
			return (
				<FormCheckbox
					{...componentProps}
					value={Boolean(value)}
					disabled={disabled}
					labelPlacement='end'
					onChange={onChange}
				/>
			);
		case 'selection':
			return (
				<FormDropdown
					{...componentProps}
					value={value as never}
					isMultiSelect={field.isMultiSelect}
					required={required}
					disabled={disabled}
					options={options as never}
					onChange={onChange}
				/>
			);
		case 'date':
		case 'time':
		case 'datetime':
			return (
				<FormPicker
					{...componentProps}
					type={field.type}
					value={isDayjs(value) ? value : null}
					required={required}
					disabled={disabled}
					onChange={onChange}
				/>
			);
		case 'string':
		case 'float':
		case 'int':
			return (
				<FormTextfield
					{...componentProps}
					value={String(value)}
					isSecret={field.type === 'string' && field.isSecret}
					required={required}
					disabled={disabled}
					suggestions={passedOptions as never}
					type={
						field.type === 'int' || field.type === 'float'
							? 'number'
							: undefined
					}
					inputProps={{
						...field.inputProps,
						step:
							field.inputProps?.step ??
							(field.type === 'float' ? 'any' : undefined),
					}}
					onChange={onChange}
				/>
			);
	}
};
