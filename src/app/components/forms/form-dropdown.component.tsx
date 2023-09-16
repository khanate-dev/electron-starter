import { Autocomplete, TextField } from '@mui/material';

import type { AutocompleteProps, TextFieldProps } from '@mui/material';
import type { ElementType } from 'react';
import type { App } from '~/app/types/app.types';
import type { Mui } from '~/app/types/mui.types';

export type FormDropdownProps<Type extends App.dropdownType> = Mui.propsWithSx<
	{
		/** the configuration object for current form field */
		options: App.dropdownOption<Type>[];

		/** the size of the form field */
		size: TextFieldProps['size'];

		/** the label to show for the field */
		label?: string;

		/** the input props to pass to the underlying TextField component */
		inputProps?: TextFieldProps['inputProps'];

		/** is the form field in disabled state? */
		disabled?: boolean;

		/** is the dropdown a required field? */
		required?: boolean;
	} & (
		| {
				/** is the dropdown a multi-select */
				isMultiSelect?: false;

				/** the current selection value */
				value: Type | null;

				/** the callback function for selection change event */
				onChange: (value: Type | null) => void;
		  }
		| {
				/** is the dropdown a multi-select */
				isMultiSelect: true;

				/** the current selection value */
				value: Type[];

				/** the callback function for selection change event */
				onChange: (value: Type[]) => void;
		  }
	)
>;

export const FormDropdown = <Type extends App.dropdownType>({
	label,
	options,
	value,
	onChange,
	required,
	isMultiSelect,
	inputProps,
	...autocompleteProps
}: FormDropdownProps<Type>) => {
	const sharedProps = {
		...autocompleteProps,
		options: options as never,
		renderInput: (params) => (
			<TextField
				{...params}
				label={label}
				InputLabelProps={!label ? { shrink: false } : undefined}
				inputProps={{ ...params.inputProps, ...inputProps }}
				required={required && (!isMultiSelect || !value.length)}
			/>
		),
	} satisfies Partial<
		AutocompleteProps<Type, boolean, boolean, boolean, ElementType>
	>;

	if (isMultiSelect) {
		return (
			<Autocomplete
				{...sharedProps}
				value={options.filter((row) => value.includes(row.value))}
				multiple
				disableCloseOnSelect
				onChange={(_, changed) => {
					onChange(changed.map((row) => row.value));
				}}
			/>
		);
	}

	return (
		<Autocomplete
			{...sharedProps}
			value={options.find((row) => value === row.value) ?? null}
			onChange={(_, changed) => {
				onChange(changed?.value ?? null);
			}}
		/>
	);
};
