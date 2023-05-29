import { Stack } from '@mui/material';
import { isDayjs } from 'dayjs';

import { csx } from '~/app/helpers/style';
import { FormCheckbox } from '~/app/components/forms/form-checkbox';
import { FormDropdown } from '~/app/components/forms/form-dropdown';
import { FormTextfield } from '~/app/components/forms/form-textfield';
import { FormReadonly } from '~/app/components/forms/form-readonly';
import { FormPicker } from '~/app/components/forms/form-picker';
import { FieldActions } from '~/app/components/app/field-actions';

import type { FieldAction } from '~/app/components/app/field-actions';
import type { TextFieldProps } from '@mui/material';
import type { FormFieldZodType, FormSchemaField } from '~/app/schemas';

export type FormFieldProps<
	Type extends FormFieldZodType,
	WorkingObj extends Obj,
	ObjKeys extends keyof WorkingObj,
	Field extends FormSchemaField<Type, WorkingObj>,
	Name extends ObjKeys
> = {
	/** the styles to apply to the container */
	sx?: Mui.SxProp;

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

	/** the actions for the field */
	actions?: FieldAction[];

	/** the size of the form field */
	size?: TextFieldProps['size'];

	/** should labels be shown on form fields? */
	noLabel?: boolean;

	/** should the form field be disabled? */
	disabled?: boolean;

	/** should the actions be disabled */
	disableActions?: boolean;

	/** should the actions use a full button instead of icon buttons? */
	fullButtonActions?: boolean;
} & (Field['type'] extends 'selection'
	? {
			/** the object containing the lists for dropdown fields */
			options: Exclude<WorkingObj[Name], null> extends App.DropdownType
				? App.DropdownOption<Exclude<WorkingObj[Name], null>>[]
				: never;
	  }
	: Field extends { hasSuggestions: true }
	? {
			/** the object containing the lists for dropdown fields */
			options: Field['type'] extends 'string' ? string[] : number[];
	  }
	: {
			options?: undefined;
	  });

export const FormField = <
	Type extends FormFieldZodType,
	WorkingObj extends Obj,
	ObjKeys extends keyof WorkingObj,
	Field extends FormSchemaField<Type, WorkingObj>,
	Name extends ObjKeys
>({
	sx,
	field,
	formValues,
	options: passedOptions,
	onChange,
	actions,
	size,
	noLabel,
	disabled,
	disableActions,
	fullButtonActions,
}: FormFieldProps<Type, WorkingObj, ObjKeys, Field, Name>) => {
	const componentProps = {
		size,
		sx: {
			flexGrow: 1,
			flexShrink: 1,
		},
		label: !noLabel ? field.label : undefined,
	};

	const required = field.type !== 'readonly' && !field.notRequired;
	const value = formValues[field.name];
	const options =
		field.type === 'selection'
			? field.filter?.(passedOptions as never, formValues) ??
			  passedOptions ??
			  []
			: (field.type === 'int' ||
					field.type === 'string' ||
					field.type === 'float') &&
			  field.hasSuggestions
			? passedOptions ?? []
			: [];
	const inputProps =
		field.type === 'int' || field.type === 'float' || field.type === 'string'
			? typeof field.inputProps === 'function'
				? field.inputProps(formValues)
				: field.inputProps
			: {};

	return (
		<Stack
			direction='row'
			sx={csx(
				{
					display: 'flex',
					flexWrap: 'nowrap',
					justifyContent: 'space-between',
					alignItems: 'center',
					gap: '5px',
				},
				sx
			)}
		>
			{field.type === 'readonly' ? (
				<FormReadonly
					{...componentProps}
					value={field.getValue?.(formValues[field.name] as never) ?? value}
				/>
			) : field.type === 'boolean' ? (
				<FormCheckbox
					{...componentProps}
					value={Boolean(value)}
					disabled={disabled}
					labelPlacement='end'
					onChange={onChange}
				/>
			) : field.type === 'selection' ? (
				<FormDropdown
					{...componentProps}
					value={value as never}
					isMultiSelect={field.isMultiSelect}
					required={required}
					disabled={disabled}
					options={options as never}
					onChange={onChange}
				/>
			) : field.type === 'date' ||
			  field.type === 'time' ||
			  field.type === 'datetime' ? (
				<FormPicker
					{...componentProps}
					type={field.type}
					value={isDayjs(value) ? value : null}
					required={required}
					disabled={disabled}
					onChange={onChange}
				/>
			) : (
				<FormTextfield
					{...componentProps}
					value={String(value)}
					isSecret={field.type === 'string' && field.isSecret}
					required={required}
					disabled={disabled}
					suggestions={
						(field.type === 'int' ||
							field.type === 'string' ||
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
							field.type === 'float') &&
						field.hasSuggestions
							? (passedOptions as never)
							: undefined
					}
					type={
						field.type === 'int' || field.type === 'float'
							? 'number'
							: undefined
					}
					inputProps={{
						...inputProps,
						step:
							inputProps?.step ?? (field.type === 'float' ? 'any' : undefined),
					}}
					onChange={onChange}
				/>
			)}
			{actions && (
				<FieldActions
					actions={actions}
					disabled={disableActions || disabled}
					fullButtons={fullButtonActions}
				/>
			)}
		</Stack>
	);
};
