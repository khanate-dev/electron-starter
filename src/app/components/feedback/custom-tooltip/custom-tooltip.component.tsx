import { Tooltip } from '@mui/material';

import { csx } from '~/app/helpers/style';

import type { TooltipProps } from '@mui/material';

const borderColor = {
	light: 'grey.800',
	dark: 'grey.200',
};

const arrow = 8;

export type CustomTooltipProps = {
	/** should the tooltip arrow be hidden? */
	hideArrow?: boolean;
} & Omit<TooltipProps, 'arrow'>;

export const CustomTooltip = ({
	sx,
	hideArrow,
	...muiProps
}: CustomTooltipProps) => (
	<Tooltip
		placement='top'
		slotProps={{
			tooltip: {
				sx: csx(
					{
						fontSize: 12,
						backgroundColor: ({ palette }) => `secondary.${palette.mode}`,
						color: ({ palette }) => borderColor[palette.mode],
						boxShadow: 'inset 0 0 0 2px currentColor',
						position: 'relative',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: 'fit-content',
						'& *': {
							color: 'inherit',
						},
					},
					sx
					// TODO fix the type error on Tooltip's sx prop
				) as never,
			},
			popper: {
				sx: !hideArrow
					? {
							'& > .MuiTooltip-tooltip::before': {
								content: '""',
								position: 'absolute',
								border: `${arrow}px solid transparent`,
							},
							'&[data-popper-placement^=top] > .MuiTooltip-tooltip::before': {
								bottom: arrow * -2,
								borderTopWidth: arrow,
								borderTopStyle: 'solid',
								borderTopColor: ({ palette }) => borderColor[palette.mode],
							},
							'&[data-popper-placement=top-start] > .MuiTooltip-tooltip': {
								borderBottomLeftRadius: 1,
								'&::before': {
									left: 0,
								},
							},
							'&[data-popper-placement=top-end] > .MuiTooltip-tooltip': {
								borderBottomRightRadius: 1,
								'&::before': {
									right: 0,
								},
							},

							'&[data-popper-placement^=bottom] > .MuiTooltip-tooltip::before':
								{
									top: arrow * -2,
									borderBottomWidth: arrow,
									borderBottomStyle: 'solid',
									borderBottomColor: ({ palette }) => borderColor[palette.mode],
								},
							'&[data-popper-placement=bottom-start] > .MuiTooltip-tooltip': {
								borderTopLeftRadius: 1,
								'&::before': {
									left: 0,
								},
							},
							'&[data-popper-placement=bottom-end] > .MuiTooltip-tooltip': {
								borderTopRightRadius: 1,
								'&::before': {
									right: 0,
								},
							},

							'&[data-popper-placement^=left] > .MuiTooltip-tooltip::before': {
								right: arrow * -2,
								borderLeftWidth: arrow,
								borderLeftStyle: 'solid',
								borderLeftColor: ({ palette }) => borderColor[palette.mode],
							},
							'&[data-popper-placement=left-start] > .MuiTooltip-tooltip': {
								borderTopRightRadius: 1,
								'&::before': {
									top: 0,
								},
							},
							'&[data-popper-placement=left-end] > .MuiTooltip-tooltip': {
								borderBottomRightRadius: 1,
								'&::before': {
									bottom: 0,
								},
							},

							'&[data-popper-placement^=right] > .MuiTooltip-tooltip::before': {
								left: arrow * -2,
								borderRightWidth: arrow,
								borderRightStyle: 'solid',
								borderRightColor: ({ palette }) => borderColor[palette.mode],
							},
							'&[data-popper-placement=right-start] > .MuiTooltip-tooltip': {
								borderTopLeftRadius: 1,
								'&::before': {
									top: 0,
								},
							},
							'&[data-popper-placement=right-end] > .MuiTooltip-tooltip': {
								borderBottomLeftRadius: 1,
								'&::before': {
									bottom: 0,
								},
							},
					  }
					: undefined,
			},
		}}
		{...muiProps}
	/>
);
