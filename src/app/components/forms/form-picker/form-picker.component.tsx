import { DateTimePicker, DatePicker, TimePicker } from '@mui/x-date-pickers';

import type { Dayjs } from 'dayjs';
import type { TextFieldProps } from '@mui/material';

const pickerComponents = {
	datetime: DateTimePicker,
	date: DatePicker,
	time: TimePicker,
};

export type FormPickerProps = {
	/** the styles to pass to the underlying form component */
	sx?: Mui.SxProp;

	type: keyof typeof pickerComponents;

	/** the current selection value */
	value: Dayjs | null;

	/** the callback function for input change event */
	onChange: (value: Dayjs | null) => void;

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
};

export const FormPicker = ({
	sx,
	type,
	value,
	onChange,
	disabled,
	...textFieldProps
}: FormPickerProps) => {
	const Component = pickerComponents[type];
	return (
		<Component
			sx={sx}
			disabled={disabled}
			value={value}
			slotProps={{ textField: textFieldProps }}
			ampm
			onChange={onChange}
		/>
	);
};
