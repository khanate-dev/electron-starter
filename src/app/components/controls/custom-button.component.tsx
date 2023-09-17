import { Button, IconButton } from '@mui/material';

import { CustomTooltip } from '~/app/components/feedback/custom-tooltip.component';
import { csx, getLoadingStyles } from '~/app/helpers/style.helpers';
import { excludeString } from '~/shared/helpers/type.helpers';

import type {
	ButtonProps,
	IconButtonProps as MuiIconButtonProps,
	TooltipProps,
} from '@mui/material';
import type { ReactNode } from 'react';
import type { Utils } from '~/shared/types/utils.types';

type ButtonBaseProps = Pick<
	ButtonProps,
	'sx' | 'onClick' | 'form' | 'type' | 'size' | 'disabled'
> & {
	/** the button's label */
	label: ReactNode;

	/** is the button currently in a loading state */
	isBusy?: boolean;
};

export type CustomButtonProps = ButtonBaseProps &
	Utils.includeUnionKeys<
		| {
				/** should the button use a MUI IconButton? */
				isIcon: true;

				/** the icon for the button */
				icon: ReactNode;

				/** the color of the button */
				color?: MuiIconButtonProps['color'];

				/** the props to pass to Mui IconButton components */
				buttonProps?: MuiIconButtonProps;

				/** props to pass to the CustomTooltip component. pass `false` to skip the tooltip */
				tooltip?: false | Omit<TooltipProps, 'children' | 'title'>;
		  }
		| {
				/** should the button use a MUI IconButton? */
				isIcon?: false;

				/** the icon for the button */
				icon?: ReactNode | undefined;

				/** the color of the button */
				color?: ButtonProps['color'];

				/** the variant of the Mui Button to use */
				variant?: ButtonProps['variant'];

				/** the props to pass to Mui Button components */
				buttonProps?: ButtonProps;

				/** should the icon be placed on button's end? */
				isEndIcon?: boolean;
		  }
	>;

export type IconButtonProps = Extract<CustomButtonProps, { isIcon: true }>;

export type FullButtonProps = Extract<CustomButtonProps, { isIcon?: false }>;

export const CustomButton = ({
	sx,
	label,
	icon,
	onClick,
	color,
	variant,
	size,
	form,
	type,
	buttonProps,
	disabled,
	isIcon,
	tooltip,
	isEndIcon,
	isBusy,
}: CustomButtonProps) => {
	const parentSx = sx ?? buttonProps?.sx ?? [];
	const sxProp = csx(
		Boolean(isBusy) &&
			getLoadingStyles(
				excludeString(color, ['inherit', 'default']) ?? 'primary',
			),
		!label && {
			'& > .MuiButton-startIcon': { marginRight: 0 },
			'& > .MuiButton-endIcon': { marginLeft: 0 },
		},
		parentSx,
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
			sx={csx({ aspectRatio: '1' }, sxProp)}
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

	if (tooltip === false || disabled) return iconButton;

	return (
		<CustomTooltip
			title={label}
			{...tooltip}
		>
			{iconButton}
		</CustomTooltip>
	);
};
