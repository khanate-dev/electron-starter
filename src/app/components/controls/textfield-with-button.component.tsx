import { TextField } from '@mui/material';
import { useState } from 'react';

import { CustomButton } from './custom-button.component';

import type { TextFieldProps } from '@mui/material';
import type { CustomButtonProps } from './custom-button.component';

export type TextFieldWithButtonProps = Omit<TextFieldProps, 'onSubmit'> & {
	/** the function to call when the button is clicked, or enter pressed */
	onSubmit: (value: string) => Promise<void>;

	/** the props to pass to the button */
	buttonProps?: CustomButtonProps;
};

export const TextFieldWithButton = ({
	onSubmit,
	buttonProps,
	...props
}: TextFieldWithButtonProps) => {
	const [value, setValue] = useState('');

	const handleSubmit = async () => {
		if (!value.trim()) return;
		await onSubmit(value.trim());
		setValue('');
	};

	return (
		<TextField
			{...props}
			value={value}
			size={props.size ?? 'medium'}
			InputProps={{
				...props.InputProps,
				endAdornment: (
					<CustomButton
						{...buttonProps}
						sx={{ whiteSpace: 'nowrap' }}
						label={buttonProps?.label ?? 'Submit'}
						disabled={props.disabled || buttonProps?.disabled || !value.trim()}
						onClick={handleSubmit}
					/>
				),
			}}
			onChange={({ target }) => {
				setValue(target.value);
			}}
			onKeyUp={(event) => {
				if (event.key === 'Enter') handleSubmit();
			}}
		/>
	);
};
