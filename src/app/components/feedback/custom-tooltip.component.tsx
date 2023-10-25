import { Tooltip } from '@mui/material';

import { csx } from '../../helpers/style.helpers';

import type { Theme, TooltipProps } from '@mui/material';
import type { SystemCssProperties } from '@mui/system';

const arrow = 8;

const borderColor: SystemCssProperties<Theme>['borderColor'] = (theme) =>
	`grey.${theme.palette.mode === 'light' ? 800 : 200}`;

export type CustomTooltipProps = Omit<TooltipProps, 'arrow'> & {
	/** should the tooltip arrow be hidden? */
	hideArrow?: boolean;

	/** should the tooltip be disabled  */
	disabled?: boolean;
};

export const CustomTooltip = ({
	sx,
	hideArrow,
	disabled,
	...props
}: CustomTooltipProps) => (
	<Tooltip
		{...props}
		placement={props.placement ?? 'top'}
		disableHoverListener={disabled ?? props.disableHoverListener}
		disableFocusListener={disabled ?? props.disableFocusListener}
		disableTouchListener={disabled ?? props.disableTouchListener}
		disableInteractive={disabled ?? props.disableInteractive}
		slotProps={{
			tooltip: {
				sx: csx(
					{
						fontSize: 12,
						backgroundColor: ({ palette }) => `secondary.${palette.mode}`,
						color: borderColor,
						boxShadow: 'inset 0 0 0 2px currentColor',
						position: 'relative',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: 'fit-content',
						padding: 1,
						'& *': { color: 'inherit' },
					},
					sx,
				),
			},
			popper: {
				sx: !hideArrow
					? {
							'& > .MuiTooltip-tooltip::before': {
								content: '""',
								position: 'absolute',
								borderWidth: arrow,
								borderStyle: 'solid',
								borderColor: 'transparent',
							},
							'&[data-popper-placement^=top] > .MuiTooltip-tooltip::before': {
								bottom: arrow * -2,
								borderTopColor: borderColor,
							},
							'&[data-popper-placement=top-start] > .MuiTooltip-tooltip': {
								borderBottomLeftRadius: 1,
								'&::before': { left: 0 },
							},
							'&[data-popper-placement=top-end] > .MuiTooltip-tooltip': {
								borderBottomRightRadius: 1,
								'&::before': { right: 0 },
							},

							'&[data-popper-placement^=bottom] > .MuiTooltip-tooltip::before':
								{
									top: arrow * -2,
									borderBottomColor: borderColor,
								},
							'&[data-popper-placement=bottom-start] > .MuiTooltip-tooltip': {
								borderTopLeftRadius: 1,
								'&::before': { left: 0 },
							},
							'&[data-popper-placement=bottom-end] > .MuiTooltip-tooltip': {
								borderTopRightRadius: 1,
								'&::before': { right: 0 },
							},

							'&[data-popper-placement^=left] > .MuiTooltip-tooltip::before': {
								right: arrow * -2,
								borderLeftColor: borderColor,
							},
							'&[data-popper-placement=left-start] > .MuiTooltip-tooltip': {
								borderTopRightRadius: 1,
								'&::before': { top: 0 },
							},
							'&[data-popper-placement=left-end] > .MuiTooltip-tooltip': {
								borderBottomRightRadius: 1,
								'&::before': { bottom: 0 },
							},

							'&[data-popper-placement^=right] > .MuiTooltip-tooltip::before': {
								left: arrow * -2,
								borderRightColor: borderColor,
							},
							'&[data-popper-placement=right-start] > .MuiTooltip-tooltip': {
								borderTopLeftRadius: 1,
								'&::before': { top: 0 },
							},
							'&[data-popper-placement=right-end] > .MuiTooltip-tooltip': {
								borderBottomLeftRadius: 1,
								'&::before': { bottom: 0 },
							},
					  }
					: undefined,
			},
		}}
	/>
);
