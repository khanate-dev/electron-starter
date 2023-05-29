import { createTheme, lighten, darken } from '@mui/material';

import './font.css';

const DARK_LIGHTEN = 0.25;

const background = {
	light: '#f7f7f7',
	dark: '#313038',
};
const paper = {
	light: '#FFFFFF',
	dark: '#393845',
};
const contrastText = '#fff';
const primary = {
	light: '#785ee0',
	dark: lighten('#785ee0', DARK_LIGHTEN),
};
const secondary = {
	light: '#a595e8',
	dark: lighten('#a595e8', DARK_LIGHTEN),
};

const error = '#FF5555';
const success = '#2ACC53';
const info = '#2BADFF';
const warning = '#e8ad56';

const wimetrixPrimary = {
	light: '#58595b',
	dark: '#e7e7e7',
};
const wimetrixSecondary = {
	light: '#428831',
	dark: lighten('#428831', DARK_LIGHTEN),
};

const scrollbar = {
	background: {
		light: lighten(secondary.light, 0.8),
		dark: darken(secondary.dark, 0.5),
	},
	thumb: {
		light: lighten(secondary.light, DARK_LIGHTEN),
		dark: darken(secondary.dark, DARK_LIGHTEN),
	},
};

const getBaseTheme = (mode: 'light' | 'dark') =>
	createTheme({
		palette: {
			mode,
			background: {
				default: background[mode],
				paper: paper[mode],
			},
			primary: {
				main: primary[mode],
				contrastText: '#fff',
			},
			secondary: {
				main: secondary[mode],
				contrastText,
			},
			error: {
				main: error,
				contrastText,
			},
			warning: {
				main: warning,
				contrastText,
			},
			info: {
				main: info,
				contrastText,
			},
			success: {
				main: success,
				contrastText,
			},
			wimetrixPrimary: {
				main: wimetrixPrimary[mode],
				contrastText,
			},
			wimetrixSecondary: {
				main: wimetrixSecondary[mode],
				contrastText,
			},
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

export const getMuiTheme = (mode: 'light' | 'dark') => {
	const theme = getBaseTheme(mode);

	return createTheme({
		...theme,
		shape: {
			borderRadius: 8,
		},
		components: {
			MuiOutlinedInput: {
				styleOverrides: {
					notchedOutline: {
						borderWidth: 2,
						':hover': {
							borderWidth: 2,
						},
					},
				},
			},
			MuiDivider: {
				styleOverrides: {
					root: {
						borderWidth: 1,
					},
				},
			},
			MuiButton: {
				styleOverrides: {
					outlined: {
						borderWidth: 2,
						':hover': {
							borderWidth: 2,
						},
					},
				},
			},
			MuiCssBaseline: {
				styleOverrides: {
					body: {
						display: 'flex',
						width: '100%',
						height: '100vh',
						overflow: 'hidden',
						fontSize: 12,
					},
					label: {
						textTransform: 'capitalize',
					},
					th: {
						textTransform: 'capitalize',
					},
					'#root': {
						display: 'flex',
						width: '100%',
						height: '100%',
						overflow: 'hidden',
						flexWrap: 'nowrap',
					},
					'::-webkit-scrollbar': {
						height: 7,
						width: 7,
						borderRadius: 3,
						backgroundColor: scrollbar.background[mode],
					},
					'::-webkit-scrollbar-thumb': {
						borderRadius: 3,
						backgroundColor: scrollbar.thumb[mode],
					},
					'.scroll-x, .scroll-y, .scroll-xy': {
						scrollbarColor: `${scrollbar.thumb[mode]} ${scrollbar.background[mode]}`,
						scrollBehavior: 'smooth',
					},
					'.scroll-x': {
						overflowX: 'auto',
						overflowY: 'hidden',
						flexWrap: 'nowrap',
					},
					'.scroll-y': {
						overflowX: 'hidden',
						overflowY: 'auto',
						flexWrap: 'nowrap',
					},
					'.scroll-xy': {
						overflowX: 'auto',
						overflowY: 'auto',
						flexWrap: 'nowrap',
					},
				},
			},
		},
	});
};
