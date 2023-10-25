import { Checkbox, FormControlLabel, alpha } from '@mui/material';

import { csx, getOppositeColor } from '~/helpers/style.helpers';

import type { CheckboxProps } from '@mui/material';
import type { Mui } from '~/types/mui.types';

export type FormCheckboxProps = Mui.propsWithSx<{
	/** the size of the form field */
	size: CheckboxProps['size'];

	/** the current checked status of the checkbox */
	value: boolean;

	/** the callback function for the change event */
	onChange: (value: boolean) => void;

	/** the label to show for the field */
	label?: string;

	/** the placement of the Checkbox label. @default 'start' */
	labelPlacement?: 'start' | 'end' | 'top' | 'bottom';

	/** the color of the Checkbox. @default 'primary' */
	color?: 'default' | 'primary' | 'secondary';

	/** is the form field in disabled state? */
	disabled?: boolean;
}>;

export const FormCheckbox = ({
	sx: passedSx,
	value,
	onChange,
	label,
	labelPlacement = 'start',
	color = 'primary',
	size,
	disabled,
}: FormCheckboxProps) => {
	const sx = csx({ margin: 0 }, passedSx);

	const control = (
		<Checkbox
			color={color}
			value={label}
			checked={value}
			size={size}
			disabled={disabled}
			sx={csx(
				{
					width: 'auto',
					padding: !label ? (size === 'small' ? 0.75 : 1.25) : 0,
					'& > svg': {
						fontSize: '1.75em',
					},
				},
				!label && sx,
				!label && {
					flexGrow: 0,
					flexShrink: 0,
					marginInline: 'auto',
				},
			)}
			onChange={() => {
				onChange(!value);
			}}
		/>
	);

	if (!label) return control;

	return (
		<FormControlLabel
			control={control}
			label={label}
			labelPlacement={labelPlacement}
			sx={csx(
				{
					borderWidth: 2,
					borderStyle: 'solid',
					borderColor: value ? 'primary.main' : 'action.disabled',
					backgroundColor: value
						? (theme) => alpha(theme.palette.primary.light, 0.2)
						: undefined,
					borderRadius: 1,
					paddingBlock: size === 'small' ? 0.75 : 1.25,
					paddingInline: size === 'small' ? 1 : 2,
					gap: 0.5,
					'&:hover': {
						borderColor: value ? getOppositeColor : 'action.active',
					},
				},
				sx,
			)}
		/>
	);
};
