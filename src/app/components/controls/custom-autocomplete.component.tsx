import { Autocomplete, TextField } from '@mui/material';
import { z } from 'zod';

import { dropdownOptionSchema } from '../../helpers/schema.helpers';
import { csx } from '../../helpers/style.helpers';

import type {
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	AutocompleteProps,
	AutocompleteValue,
	ChipTypeMap,
	TextFieldProps,
} from '@mui/material';
import type { Utils } from '../../../shared/types/utils.types';
import type { App } from '../../types/app.types';

export type CustomAutocompleteProps<
	Type extends number | string | Obj,
	CalcType extends Type extends App.dropdownOption<infer T> ? T : Type,
	Multiple extends boolean | undefined = false,
	DisableClearable extends boolean | undefined = false,
	FreeSolo extends boolean | undefined = false,
	ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent'],
> = Omit<
	AutocompleteProps<Type, Multiple, DisableClearable, FreeSolo, ChipComponent>,
	'onChange' | 'getOptionLabel' | 'renderInput' | 'value' | 'defaultValue'
> & {
	/** the label to show on the text field */
	label: string;

	/** the id of the form this Autocomplete belongs to */
	form?: string;

	/** is the dropdown required? */
	required?: boolean;

	/** the size of the text field */
	size?: TextFieldProps['size'];

	/** the props for the text field */
	textFieldProps?: TextFieldProps;

	value: AutocompleteValue<CalcType, Multiple, DisableClearable, FreeSolo>;

	defaultValue?: AutocompleteValue<
		CalcType,
		Multiple,
		DisableClearable,
		FreeSolo
	>;

	/**
	 * Callback fired when the value changes.
	 * @param value The new value of the component.
	 * @param event The event source of the callback.
	 * @param reason One of "createOption", "selectOption", "removeOption", "blur" or "clear".
	 * @param [details]
	 */
	onChange: (
		value: AutocompleteValue<CalcType, Multiple, DisableClearable, FreeSolo>,
		event: React.SyntheticEvent,
		reason: AutocompleteChangeReason,
		details?: AutocompleteChangeDetails<Type>,
	) => void;
} & (CalcType extends Obj
		? {
				/** function to get the option label for object type list */
				getOptionLabel: AutocompleteProps<
					Utils.noInfer<Type>,
					Multiple,
					DisableClearable,
					FreeSolo,
					ChipComponent
				>['getOptionLabel'];
		  }
		: { getOptionLabel?: never });

export const CustomAutocomplete = <
	Type extends number | string | Obj,
	CalcType extends Type extends App.dropdownOption<infer T> ? T : Type,
	Multiple extends boolean | undefined = false,
	DisableClearable extends boolean | undefined = false,
	FreeSolo extends boolean | undefined = false,
	ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent'],
>({
	sx,
	label,
	form,
	required,
	size,
	textFieldProps,
	getOptionLabel,
	onChange,
	renderTags,
	options,
	defaultValue,
	value,
	...autocompleteProps
}: CustomAutocompleteProps<
	Type,
	CalcType,
	Multiple,
	DisableClearable,
	FreeSolo,
	ChipComponent
>) => {
	const isDropdownOption = z
		.array(dropdownOptionSchema)
		.safeParse(options).success;
	const emptyVal = autocompleteProps.multiple ? [] : null;
	return (
		<Autocomplete
			{...autocompleteProps}
			options={options}
			renderTags={renderTags}
			classes={{}}
			sx={csx(
				{ '.MuiAutocomplete-endAdornment': { top: 'calc(50% - 12.5px)' } },
				sx,
			)}
			getOptionLabel={
				(getOptionLabel ?? ((val: unknown) => String(val))) as never
			}
			defaultValue={
				isDropdownOption
					? ((options.find(
							(option) =>
								(option as App.dropdownOption<App.dropdownType>).value ===
								defaultValue,
					  ) ?? emptyVal) as never)
					: (defaultValue as never)
			}
			value={
				isDropdownOption
					? ((options.find(
							(option) =>
								(option as App.dropdownOption<App.dropdownType>).value ===
								value,
					  ) ?? emptyVal) as never)
					: (value as never)
			}
			renderInput={(params) => {
				const props: TextFieldProps = {
					...params,
					...textFieldProps,
				};
				return (
					<TextField
						{...props}
						label={label}
						size={size ?? props.size ?? 'small'}
						fullWidth={props.fullWidth ?? true}
						required={required ?? props.required}
						inputProps={{
							...props.inputProps,
							form: form ?? params.inputProps.form,
						}}
					/>
				);
			}}
			onChange={(event, val, reason, details) => {
				const valToSend = isDropdownOption
					? ((options.find(
							(option) =>
								(option as App.dropdownOption<App.dropdownType>).value ===
								(val as never),
					  ) ?? emptyVal) as never)
					: (val as never);
				onChange(valToSend, event, reason, details);
			}}
		/>
	);
};
