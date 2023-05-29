import { PAGE_HEADER_HEIGHT } from '~/app/config';
import { pageTransitionStyles } from '~/app/helpers/style';

export const pageContainerStyles = {
	header: {
		height: PAGE_HEADER_HEIGHT,
		flexGrow: 0,
		flexShrink: 0,
		flexWrap: 'nowrap',
		padding: 0,
		gap: 2,
		marginBlock: 0,
		marginInline: 1,
		width: 'calc(100% - 20px)',
		display: 'flex',
		alignItems: 'center',
	},
	title: {
		fontWeight: 'regular',
		textTransform: 'capitalize',
		whiteSpace: 'nowrap',
		fontSize: '2em',
		color: 'text.secondary',
	},
	pageBody: {
		flexGrow: 1,
		borderRadius: 1,
		margin: '0 10px 10px 10px',
		padding: 2,
		gap: 1,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'stretch',
		flexWrap: 'nowrap',
		borderWidth: 2,
		borderStyle: 'solid',
		borderColor: 'divider',
		...pageTransitionStyles,
	},
	controls: {
		display: 'flex',
		alignItems: 'center',
		gap: 1,
		'> *': {
			flexGrow: 0,
			flexShrink: 0,
		},
		'& > .MuiAutocomplete-root': {
			minWidth: 200,
		},
		'> .MuiAlert-root.showing': {
			flexShrink: 1,
			flexBasis: 'unset',
			marginTop: 0,
			padding: 0.5,
			gap: 0.5,
		},
	},
} satisfies Mui.SxStyleObj;
