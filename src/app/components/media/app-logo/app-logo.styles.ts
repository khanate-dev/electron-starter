import type { Theme } from '@mui/material';
import type { AppLogoProps } from './app-logo.component';

const getColor = (
	theme: Theme,
	color: Exclude<AppLogoProps['color'], undefined>
) =>
	({
		primary: theme.palette.primary.main,
		secondary: theme.palette.secondary.main,
		white: theme.palette.common.white,
		black: theme.palette.common.black,
	}[color]);

export const getAppLogoStyles = ({
	width,
	height,
	color,
}: Pick<AppLogoProps, 'width' | 'height' | 'color'>) => {
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
