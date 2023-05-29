import { lighten, darken, alpha } from '@mui/material';

import type { Theme } from '@mui/material';

const getBorderColor = ({ palette }: Theme) => {
	switch (palette.mode) {
		case 'light':
			return lighten(palette.primary.light, 0.7);
		case 'dark':
			return darken(palette.primary.dark, 0.2);
	}
};

const offsetColor = (
	{ palette }: Theme,
	coefficient: number,
	shade: 'primary' | 'secondary' | 'success' = 'primary'
) => {
	const colorAdjust = palette.mode === 'light' ? lighten : alpha;
	const offsetCoefficient =
		palette.mode === 'light' ? coefficient : 1 - coefficient;
	const color = palette[shade][palette.mode];
	return colorAdjust(color, offsetCoefficient);
};

const getEvenRowBackground = (theme: Theme, selected?: boolean) => {
	const base = offsetColor(theme, 1);
	if (!selected) return base;

	const highlight = offsetColor(theme, 0.8);
	return `repeating-linear-gradient(${[
		'-45deg',
		`${base} 0%`,
		`${base} 2%`,
		`${highlight} 2%`,
		`${highlight} 4%`,
	].join(', ')})`;
};

const getOddRowBackground = (theme: Theme, selected?: boolean) => {
	const base = offsetColor(theme, 0.9);
	if (!selected) return base;

	const highlight = offsetColor(theme, 0.7);
	return `repeating-linear-gradient(${[
		'-45deg',
		`${base} 0%`,
		`${base} 2%`,
		`${highlight} 2%`,
		`${highlight} 4%`,
	].join(', ')})`;
};

export const generalTableStyles = {
	container: {
		flexGrow: 1,
		flexShrink: 1,
		display: 'flex',
		flexDirection: 'column',
		flexWrap: 'nowrap',
		gap: 1,
		overflow: 'hidden',
	},
	controls: {
		flexGrow: 0,
		flexShrink: 0,
		display: 'flex',
		flexWrap: 'wrap',
		alignItems: 'center',
		displayPrint: 'none',
		paddingTop: 1,
		'> *': {
			flexShrink: 0,
		},
		'> :not(.MuiAlert-root:not(.showing), :last-child)': {
			marginRight: 1,
		},
		'& > .MuiAutocomplete-root': {
			minWidth: 200,
		},
		'> .MuiAlert-root.showing': {
			flexShrink: 0,
			flexBasis: 'unset',
			margin: 0,
			marginBottom: 2,
			padding: 0.5,
			gap: 0.5,
		},
	},
	emptyContent: {
		flexGrow: 1,
		flexShrink: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		opacity: 0.5,
		gap: 2,
		'& .MuiSvgIcon-root': {
			color: 'primary.main',
			fontSize: '8em',
		},
		'& > .MuiTypography-root': {
			color: 'primary.main',
			fontSize: '1.8em',
			textTransform: 'capitalize',
		},
	},
	tableContainer: {
		flexGrow: 1,
		flexShrink: 1,
		display: 'flex',
	},
	table: {
		height: 'fit-content',
		tableLayout: 'fixed',
		marginBlock: 0,
		marginInline: 'auto',
		fontSize: '0.8em',
		borderCollapse: 'collapse',
		borderRadius: 1,
		overflow: 'hidden',
		'@media print': {
			borderCollapse: 'separate',
			borderSpacing: 3,
		},
	},
	header: {
		'& th': {
			zIndex: 5,
			position: 'sticky',
			top: 0,
			backgroundColor: 'primary.main',
			color: 'primary.contrastText',
			paddingBlock: 2.5,
			'& span.MuiBox-root': {
				position: 'absolute',
				bottom: 2,
				right: 'calc(50% - 11px)',
				width: 22,
				height: 22,
				padding: '3px',
				borderRadius: '50%',
				cursor: 'pointer',
				opacity: 0,
				'& > svg': {
					width: '100%',
					height: '100%',
				},
				'&[data-active=true]': {
					opacity: 0.5,
				},
				'&:hover': {
					backgroundColor: 'primary.light',
				},
			},
			'&:hover span.MuiBox-root': {
				opacity: 0.7,
			},
			'@media print': {
				background: 'gray',
				color: 'white',
			},
		},
	},
	body: {
		'& > tr': {
			'&:nth-of-type(even)': {
				backgroundColor: getEvenRowBackground,
				'&.selected': {
					background: (theme) => getEvenRowBackground(theme, true),
				},
			},
			'&:nth-of-type(odd)': {
				backgroundColor: getOddRowBackground,
				'&.selected': {
					background: (theme) => getOddRowBackground(theme, true),
				},
			},
			'@media print': {
				background: 'white',
				color: 'black',
			},
		},
	},
	row: {
		transition: (theme) =>
			theme.transitions.create('background-color', {
				duration: theme.transitions.duration.shortest,
				easing: theme.transitions.easing.sharp,
			}),
		boxShadow: (theme) => `inset 0 -2px ${getBorderColor(theme)}`,
	},
	cell: {
		fontSize: '1.3em',
		border: 'none',
		paddingBlock: 2,
		paddingInline: 0.5,
		width: 'auto',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		textAlign: 'center',
		position: 'relative',
		'@media print': {
			border: '2px solid gray !important',
		},
	},
	checkboxHeader: {
		width: 75,
		padding: '0 !important',
		'& > .MuiCheckbox-root': {
			padding: 0,
			'& svg': {
				width: 25,
				height: 25,
			},
		},
	},
	checkboxCell: {
		padding: 0,
		'& > .MuiCheckbox-root': {
			padding: 0,
			'& svg': {
				width: 25,
				height: 25,
			},
		},
	},
	rowNumberHeader: {
		width: 50,
	},
	rowNumberCell: {},
	schemaFieldHeader: {},
	schemaFieldCell: {
		'& > .MuiGrid-root': {
			display: 'flex',
			flexWrap: 'nowrap',
			justifyContent: 'center',
			alignItems: 'center',
			gap: 0.5,
			'& > span:first-of-type': {
				overflow: 'hidden',
				whiteSpace: 'nowrap',
				textOverflow: 'ellipsis',
			},
		},
	},
	actionHeader: {
		width: 60,
		fontSize: '1.1em',
		padding: '5px !important',
	},
	fullActionHeader: {
		width: 100,
	},
	actionCell: {
		padding: '0 !important',
		'& > .MuiButton-root': {
			fontSize: '0.8em',
			paddingInline: 1.5,
			paddingBlock: 0.5,
		},
	},
	imageHeader: {
		width: 100,
	},
	imageCell: {
		padding: '5px 10px !important',
		'& > .MuiAvatar-root': {
			display: 'inline-flex',
			justifyContent: 'center',
			verticalAlign: 'middle',
			width: 35,
			height: 35,
			fontSize: '1.5em',
			fontWeight: 'medium',
		},
	},
	footer: {
		'& > tr > td': {
			zIndex: 5,
			backgroundColor: getBorderColor,
			position: 'sticky',
			bottom: 0,
			'@media print': {
				backgroundColor: 'silver',
			},
		},
	},
} satisfies Mui.SxStyleObj;
