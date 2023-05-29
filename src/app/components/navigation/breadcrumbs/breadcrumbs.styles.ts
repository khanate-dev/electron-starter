import { alpha } from '@mui/material';

export const breadcrumbsStyles = {
	container: {
		'& > .MuiBreadcrumbs-ol': {
			alignItems: 'stretch',
			'& > li': {
				alignItems: 'center',
				'&.MuiBreadcrumbs-li:first-of-type > a': {
					minWidth: 'unset',
				},
			},
		},
	},
	crumb: {
		all: 'unset',
		fontSize: '0.9em',
		fontWeight: 'medium',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'nowrap',
		gap: 1,
		paddingInline: 1.5,
		paddingBlock: 0.75,
		borderRadius: 2,
		minWidth: 40,
		backgroundColor: (theme) => alpha(theme.palette.text.disabled, 0.04),
		color: 'text.primary',
		transition: ({ transitions }) =>
			transitions.create(
				['color', 'background-color', 'box-shadow', 'transform'],
				{
					duration: transitions.duration.shortest,
					easing: transitions.easing.easeInOut,
				}
			),
		'a&': {
			backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
			color: 'primary.main',
			cursor: 'pointer',
			'&:hover, &:focus': {
				backgroundColor: 'primary.light',
				color: 'primary.contrastText',
				transform: 'scale(0.9)',
			},
		},
		'& > svg': {
			width: 20,
			height: 20,
			'& *': {
				fill: 'currentColor',
			},
		},
	},
} satisfies Mui.SxStyleObj;
