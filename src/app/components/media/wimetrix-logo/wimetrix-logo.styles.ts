import type { Theme } from '@mui/material';
import type { WiMetrixLogoProps } from './wimetrix-logo.component';

const getColor = (
	theme: Theme,
	color: Exclude<WiMetrixLogoProps['color'], undefined>
) =>
	({
		primary: theme.palette.wimetrixPrimary.main,
		secondary: theme.palette.wimetrixSecondary.main,
		white: theme.palette.common.white,
		black: theme.palette.common.black,
	}[color]);

export const getWiMetrixLogoStyles = ({
	width,
	height,
	color,
}: Pick<WiMetrixLogoProps, 'width' | 'height' | 'color'>) => {
	const primary = color ?? 'primary';
	const secondary = color ?? 'secondary';

	return {
		svg: {
			width,
			height,
		},
		primary: {
			fill: (theme) => getColor(theme, primary),
		},
		secondary: {
			fill: (theme) => getColor(theme, secondary),
		},
	} satisfies Mui.SxStyleObj;
};
