import { keyframes } from '@mui/material';

import { pageTransitionStyles } from '~/app/helpers/style';

const showLogo = keyframes({
	'0%': {
		width: 0,
		padding: 0,
	},
	'35%': {
		width: 0,
		padding: '50px',
	},
	'100%': {
		width: '80%',
	},
});

const triangleSize = 75;
const decorationDistance = (-1 * triangleSize) / 2;

export const emptyPageStyles = {
	container: {
		display: 'flex',
		width: '100%',
		height: '100%',
		flexWrap: 'nowrap',
		justifyContent: 'center',
		alignItems: 'center',
		...pageTransitionStyles,
	},
	image: {
		height: 'auto',
		width: '95%',
		maxHeight: '95%',
		bottom: 0,
		left: 'unset',
	},
	box: {
		width: '80%',
		maxWidth: 600,
		borderWidth: 3,
		borderStyle: 'solid',
		borderRadius: 2,
		borderColor: 'grey.400',
		padding: '50px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		position: 'relative',
		backgroundColor: 'background.paper',
		opacity: 0.9,
		animationDuration: '0.75s',
		animationTimingFunction: (theme) => theme.transitions.easing.sharp,
		animationName: String(showLogo),
		transition: (theme) =>
			theme.transitions.create('transform', {
				duration: theme.transitions.duration.shortest,
				easing: theme.transitions.easing.sharp,
			}),
		'&::before, &::after': {
			transition: (theme) =>
				theme.transitions.create(['top', 'left', 'right', 'bottom'], {
					duration: theme.transitions.duration.shortest,
					easing: theme.transitions.easing.sharp,
				}),
			content: '""',
			zIndex: -1,
			position: 'absolute',
			borderStyle: 'solid',
			borderWidth: triangleSize,
			borderRadius: 2,
		},
		'&::before': {
			borderTopColor: 'secondary.light',
			borderLeftColor: 'secondary.light',
			borderBottomColor: 'transparent',
			borderRightColor: 'transparent',
			top: decorationDistance,
			left: decorationDistance,
		},
		'&::after': {
			borderTopColor: 'transparent',
			borderLeftColor: 'transparent',
			borderBottomColor: 'secondary.light',
			borderRightColor: 'secondary.light',
			bottom: decorationDistance,
			right: decorationDistance,
		},
		'&:hover': {
			transform: 'scale(1.02)',
			'&::before': {
				top: decorationDistance - 10,
				left: decorationDistance - 10,
			},
			'&::after': {
				bottom: decorationDistance - 10,
				right: decorationDistance - 10,
			},
		},
	},
} satisfies Mui.SxStyleObj;
