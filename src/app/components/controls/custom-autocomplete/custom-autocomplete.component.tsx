import { Autocomplete, TextField } from '@mui/material';

import type {
	AutocompleteFreeSoloValueMapping,
	AutocompleteChangeDetails,
	AutocompleteChangeReason,
	AutocompleteProps,
	AutocompleteValue,
	TextFieldProps,
	ChipTypeMap,
} from '@mui/material';

export type CustomAutocompleteProps<
	Type extends number | string | Obj,
	Multiple extends boolean | undefined = false,
	DisableClearable extends boolean | undefined = false,
	FreeSolo extends boolean | undefined = false,
	ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent']
> = Omit<
	AutocompleteProps<Type, Multiple, DisableClearable, FreeSolo, ChipComponent>,
	'onChange' | 'getOptionLabel' | 'renderInput'
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

	value: AutocompleteValue<Type, Multiple, DisableClearable, FreeSolo>;

	/**
	 * Callback fired when the value changes.
	 * @param value The new value of the component.
	 * @param event The event source of the callback.
	 * @param reason One of "createOption", "selectOption", "removeOption", "blur" or "clear".
	 * @param [details]
	 */
	onChange: (
		value: true extends Multiple
			? Type | AutocompleteFreeSoloValueMapping<FreeSolo>[]
			: true extends DisableClearable
			? NonNullable<Type | AutocompleteFreeSoloValueMapping<FreeSolo>>
			: Type | null | AutocompleteFreeSoloValueMapping<FreeSolo>,
		event: React.SyntheticEvent,
		reason: AutocompleteChangeReason,
		details?: AutocompleteChangeDetails<Type>
	) => void;
} & (Type extends Obj
		? {
				/** function to get the option label for object type list */
				getOptionLabel: AutocompleteProps<
					Type,
					Multiple,
					DisableClearable,
					FreeSolo,
					ChipComponent
				>['getOptionLabel'];
		  }
		: { getOptionLabel?: never });

export const CustomAutocomplete = <
	Type extends number | string | Obj,
	Multiple extends boolean | undefined = false,
	DisableClearable extends boolean | undefined = false,
	FreeSolo extends boolean | undefined = false,
	ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent']
>({
	label,
	form,
	required,
	size,
	textFieldProps,
	getOptionLabel,
	onChange,
	renderTags,
	defaultValue,
	...autocompleteProps
}: CustomAutocompleteProps<
	Type,
	Multiple,
	DisableClearable,
	FreeSolo,
	ChipComponent
>) => (
	<Autocomplete
		{...autocompleteProps}
		getOptionLabel={getOptionLabel as never}
		renderTags={renderTags}
		defaultValue={defaultValue}
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
		onChange={(event, value, reason, details) =>
			onChange(value as never, event, reason, details)
		}
	/>
);
