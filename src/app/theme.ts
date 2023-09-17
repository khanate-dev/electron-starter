import { createTheme, darken, lighten } from '@mui/material';

import '~/app/assets/fonts/font.css';
import { pageTransitionStyles } from '~/app/helpers/style.helpers';

const DARK_LIGHTEN = 0.25;

export const colors = {
	light: {
		background: '#f7f7f7',
		paper: '#FFFFFF',
		primary: '#785ee0',
		secondary: '#a595e8',
		error: '#FF5555',
		success: '#2ACC53',
		info: '#2BADFF',
		warning: '#e8ad56',
		wimetrixPrimary: '#58595b',
		wimetrixSecondary: '#428831',
	},
	dark: {
		background: '#313038',
		paper: '#393845',
		primary: lighten('#785ee0', DARK_LIGHTEN),
		secondary: lighten('#a595e8', DARK_LIGHTEN),
		error: '#FF5555',
		success: '#2ACC53',
		info: '#2BADFF',
		warning: '#e8ad56',
		wimetrixPrimary: '#e7e7e7',
		wimetrixSecondary: lighten('#428831', DARK_LIGHTEN),
	},
};

const contrastText = '#fff';

const scroll = {
	light: {
		back: lighten(colors.light.secondary, 0.8),
		thumb: lighten(colors.light.secondary, DARK_LIGHTEN),
	},
	dark: {
		back: darken(colors.dark.secondary, 0.5),
		thumb: darken(colors.dark.secondary, DARK_LIGHTEN),
	},
};

const getBaseTheme = (mode: 'light' | 'dark') => {
	const clr = colors[mode];
	return createTheme({
		palette: {
			mode,
			background: { default: clr.background, paper: clr.paper },
			primary: { main: clr.primary, contrastText },
			secondary: { main: clr.secondary, contrastText },
			error: { main: clr.error, contrastText },
			warning: { main: clr.warning, contrastText },
			info: { main: clr.info, contrastText },
			success: { main: clr.success, contrastText },
			wimetrixPrimary: { main: clr.wimetrixPrimary, contrastText },
			wimetrixSecondary: { main: clr.wimetrixSecondary, contrastText },
		},
		typography: {
			fontFamily: 'Inter, system-ui, sans-serif',
			fontSize: 12,
			fontWeightLight: 200,
			fontWeightRegular: 400,
			fontWeightMedium: 600,
			fontWeightBold: 800,
		},
	});
};

export const getMuiTheme = (mode: 'light' | 'dark') => {
	const theme = getBaseTheme(mode);
	const { back, thumb } = scroll[mode];

	return createTheme({
		...theme,
		shape: {
			borderRadius: 8,
		},
		components: {
			MuiOutlinedInput: {
				styleOverrides: {
					notchedOutline: { borderWidth: 2, '&:hover': { borderWidth: 2 } },
				},
			},
			MuiDivider: {
				styleOverrides: {
					root: { borderWidth: 0.5, '&::before, &::after': { borderWidth: 2 } },
				},
			},
			MuiButton: {
				styleOverrides: {
					outlined: { borderWidth: 2, '&:hover': { borderWidth: 2 } },
				},
			},
			MuiCssBaseline: {
				styleOverrides: {
					'::-webkit-scrollbar': {
						height: 7,
						width: 7,
						borderRadius: 3,
						backgroundColor: back,
					},
					'::-webkit-scrollbar-thumb': {
						borderRadius: 3,
						backgroundColor: thumb,
					},
					body: {
						display: 'flex',
						width: '100%',
						height: '100vh',
						overflow: 'hidden',
						flexWrap: 'nowrap',
						scrollbarColor: `${thumb} ${back}`,
						scrollBehavior: 'smooth',
						// TODO Look into removing font-size on body
						fontSize: 12,
					},
					'#root': {
						display: 'flex',
						width: '100%',
						height: '100%',
						overflow: 'hidden',
						flexWrap: 'nowrap',
						...pageTransitionStyles,
					},
				},
			},
		},
	});
};
