import { APP_HEADER_HEIGHT } from '~/app/config';
import { pageTransitionStyles } from '~/app/helpers/style';

export const homeStyles = {
	container: {
		transition: (theme) =>
			theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
		flexGrow: 1,
		flexShrink: 1,
		...pageTransitionStyles,
	},
	header: {
		transition: (theme) =>
			theme.transitions.create(['width', 'margin'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
		backgroundColor: 'background.paper',
		width: '100%',
		height: APP_HEADER_HEIGHT,
	},
	toolbar: {
		height: APP_HEADER_HEIGHT,
		paddingRight: 1,
		paddingLeft: `${APP_HEADER_HEIGHT + 5}px`,
		position: 'relative',
		minHeight: `${APP_HEADER_HEIGHT}px !important`,
		display: 'flex',
		alignItems: 'center',
		flexWrap: 'nowrap',
		gap: 1,
		margin: 0,
		borderBottomWidth: 2,
		borderBottomStyle: 'solid',
		borderBottomColor: 'divider',
		'& > .MuiBreadcrumbs-root': {
			marginRight: 'auto',
		},
	},
	logo: {
		width: 125,
		height: '100%',
		position: 'absolute',
		top: 0,
		left: 'calc(50% - 90px)',
		display: 'flex',
		justifyContent: 'center',
	},
	main: {
		width: '100%',
		height: `calc(100vh - ${APP_HEADER_HEIGHT}px)`,
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		flexWrap: 'nowrap',
	},
} satisfies Mui.SxStyleObj;
