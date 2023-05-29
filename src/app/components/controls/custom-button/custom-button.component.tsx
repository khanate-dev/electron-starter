import { Button, IconButton } from '@mui/material';

import { csx, getLoadingStyles } from '~/app/helpers/style';
import { CustomTooltip } from '~/app/components/feedback/custom-tooltip';
import { excludeString } from '~/shared/helpers/type';

import type { MouseEventHandler } from 'react';
import type {
	ButtonProps,
	IconButtonProps as MuiIconButtonProps,
	TooltipProps,
} from '@mui/material';

type ButtonBaseProps = {
	/** the styles to apply to the MUI Button or IconButton component */
	sx?: Mui.SxProp;

	/** the icon for the button */
	icon?: React.Node | undefined;

	/** the function to call when the button is clicked */
	onClick?: MouseEventHandler<HTMLButtonElement>;

	/** the id of the form this button belongs to */
	form?: ButtonProps['form'];

	/** the type of the button */
	type?: ButtonProps['type'];

	/** the size of the button */
	size?: ButtonProps['size'];

	/** should the button use a MUI IconButton? */
	isIcon?: boolean;

	/** should the button be disabled */
	disabled?: boolean;

	/** should the icon be placed on button's end? */
	isEndIcon?: boolean;

	/** is the button currently in a loading state */
	isBusy?: boolean;
};

export type IconButtonProps = {
	/** should the button use a MUI IconButton? */
	isIcon: true;

	/** the icon for the button */
	icon: React.Node;

	/** the button's label */
	label?: React.Node;

	/** the class to pass to Mui tooltip */
	tooltipStyles?: Mui.SxProp;

	/** the color of the button */
	color?: MuiIconButtonProps['color'];

	variant?: undefined;

	/** the props to pass to Mui IconButton components */
	buttonProps?: MuiIconButtonProps;

	/** should the icon button not have a tooltip? */
	noTooltip?: boolean;

	/** the props to pass to the CustomTooltip component */
	tooltipProps?: Omit<TooltipProps, 'children' | 'title'>;

	isEndIcon?: undefined;
} & ButtonBaseProps;

export type FullButtonProps = {
	/** should the button use a MUI IconButton? */
	isIcon?: false;

	/** the class to pass to Mui tooltip */
	tooltipStyles?: undefined;

	/** the button's label */
	label: React.Node;

	/** the color of the button */
	color?: ButtonProps['color'];

	/** the variant of the Mui Button to use */
	variant?: ButtonProps['variant'];

	/** the props to pass to Mui Button components */
	buttonProps?: ButtonProps;

	/** should the icon button have a tooltip? */
	noTooltip?: undefined;

	/** the props to pass to the CustomTooltip component */
	tooltipProps?: undefined;

	/** should the icon be placed on button's end? */
	isEndIcon?: boolean;
} & ButtonBaseProps;

export type CustomButtonProps = IconButtonProps | FullButtonProps;

export const CustomButton = ({
	sx,
	label,
	icon,
	tooltipStyles,
	onClick,
	color,
	variant,
	size,
	form,
	type,
	buttonProps,
	disabled,
	isIcon,
	noTooltip,
	tooltipProps,
	isEndIcon,
	isBusy,
}: CustomButtonProps) => {
	const parentSx = sx ?? buttonProps?.sx ?? [];
	const sxProp = csx(
		Boolean(isBusy) &&
			getLoadingStyles(
				excludeString(color, ['inherit', 'default']) ?? 'primary'
			),
		!label && {
			'& > .MuiButton-startIcon': {
				marginRight: 0,
			},
			'& > .MuiButton-endIcon': {
				marginLeft: 0,
			},
		},
		parentSx
	);

	if (!isIcon) {
		return (
			<Button
				{...buttonProps}
				sx={sxProp}
				startIcon={!isEndIcon ? icon ?? buttonProps?.startIcon : undefined}
				endIcon={isEndIcon ? icon ?? buttonProps?.endIcon : undefined}
				variant={variant ?? buttonProps?.variant ?? 'contained'}
				color={color ?? buttonProps?.color ?? 'primary'}
				form={form ?? buttonProps?.form}
				type={type ?? buttonProps?.type}
				disabled={isBusy || (disabled ?? buttonProps?.disabled)}
				size={size ?? buttonProps?.size ?? 'medium'}
				disableElevation
				onClick={onClick ?? buttonProps?.onClick}
			>
				{label}
			</Button>
		);
	}

	const iconButton = (
		<IconButton
			{...buttonProps}
			sx={sxProp}
			color={color ?? buttonProps?.color ?? 'primary'}
			form={form ?? buttonProps?.form}
			type={type ?? buttonProps?.type}
			disabled={isBusy || (disabled ?? buttonProps?.disabled)}
			size={size ?? buttonProps?.size ?? 'large'}
			onClick={onClick ?? buttonProps?.onClick}
		>
			{icon}
		</IconButton>
	);

	if (noTooltip || !label || disabled) return iconButton;

	return (
		<CustomTooltip
			sx={tooltipStyles}
			title={label}
			{...tooltipProps}
		>
			{iconButton}
		</CustomTooltip>
	);
};
