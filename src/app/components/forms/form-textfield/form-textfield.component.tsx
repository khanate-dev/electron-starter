import { useState } from 'react';
import {
	IconButton,
	TextField,
	InputAdornment,
	Autocomplete,
} from '@mui/material';
import {
	Visibility as HidePasswordIcon,
	VisibilityOff as ShowPasswordIcon,
} from '@mui/icons-material';

import type { TextFieldProps } from '@mui/material';

export type FormTextfieldProps = {
	/** the styles to pass to the underlying form component */
	sx?: Mui.SxProp;

	/** the type of the `input` tag */
	type?: TextFieldProps['type'];

	/** the current selection value */
	value: string;

	/** the callback function for input change event */
	onChange: (value: string) => void;

	/** the size of the form field */
	size: TextFieldProps['size'];

	/** the label to show for the field */
	label?: string;

	/** the list of suggestions to offer */
	suggestions?: (string | number)[];

	/** the input props to pass to the underlying TextField component */
	inputProps?: TextFieldProps['inputProps'];

	/** is the text field for secrets like password? */
	isSecret?: boolean;

	/** is the form field in disabled state? */
	disabled?: boolean;

	/** is the dropdown a required field? */
	required?: boolean;
};

export const FormTextfield = ({
	sx,
	value,
	onChange,
	isSecret,
	type,
	suggestions,
	size,
	disabled,
	...textFieldProps
}: FormTextfieldProps) => {
	const [isSecretVisible, setIsSecretVisible] = useState(false);

	const textProps = {
		...textFieldProps,
		InputLabelProps: !textFieldProps.label ? { shrink: false } : undefined,
		type: isSecret && !isSecretVisible ? 'password' : type,
	} satisfies TextFieldProps;

	if (!suggestions) {
		return (
			<TextField
				{...textProps}
				sx={sx}
				size={size}
				disabled={disabled}
				value={value}
				InputProps={{
					endAdornment: isSecret ? (
						<InputAdornment position='end'>
							<IconButton
								edge='end'
								size='large'
								onClick={() => setIsSecretVisible((prev) => !prev)}
							>
								{isSecretVisible ? <HidePasswordIcon /> : <ShowPasswordIcon />}
							</IconButton>
						</InputAdornment>
					) : undefined,
				}}
				onChange={({ target }) => onChange(target.value)}
			/>
		);
	}

	return (
		<Autocomplete
			sx={sx}
			size={size}
			disabled={disabled}
			value={value}
			options={suggestions.map(String)}
			renderInput={(params) => (
				<TextField
					{...params}
					{...textProps}
					inputProps={{ ...params.inputProps, ...textProps.inputProps }}
				/>
			)}
			freeSolo
			onInputChange={(_, val) => onChange(String(val))}
		/>
	);
};
