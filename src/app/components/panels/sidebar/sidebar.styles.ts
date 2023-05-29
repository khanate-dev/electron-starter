import { keyframes } from '@mui/material';

import {
	DRAWER_WIDTH,
	DRAWER_MINIMIZED_WIDTH,
	APP_HEADER_HEIGHT,
} from '~/app/config';

const showSmallLogo = keyframes({
	from: {
		opacity: 0,
	},
});

export const sidebarStyles = {
	drawer: {
		zIndex: (theme) => theme.zIndex.drawer + 2,
		width: DRAWER_WIDTH,
		height: '100vh',
		flexShrink: 0,
		whiteSpace: 'nowrap',
		backgroundColor: 'background.paper',
		position: 'relative',
		transition: (theme) =>
			theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
		'& > .MuiDrawer-paper': {
			transition: (theme) =>
				theme.transitions.create('width', {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.enteringScreen,
				}),
			overflow: 'unset',
			width: DRAWER_WIDTH,
			height: '100%',
			borderRightWidth: 2,
		},
	},
	drawerMinimized: {
		width: DRAWER_MINIMIZED_WIDTH,
		'& > .MuiDrawer-paper': {
			width: DRAWER_MINIMIZED_WIDTH,
		},
		'& .MuiListItemIcon-root': {
			width: '100%',
		},
	},
	drawerHeader: {
		borderRadius: 0,
		width: '100%',
		height: APP_HEADER_HEIGHT - 2,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexShrink: 0,
		'& svg': {
			width: '85%',
			height: '85%',
			animationDuration: (theme) => `${theme.transitions.duration.shortest}ms`,
			animationTimingFunction: (theme) => theme.transitions.easing.sharp,
			animationName: String(showSmallLogo),
		},
	},
	toggle: {
		position: 'absolute',
		top: 0,
		right: -APP_HEADER_HEIGHT,
		width: APP_HEADER_HEIGHT,
		height: 'auto',
		padding: '20px',
		aspectRatio: '1',
		borderRadius: 0,
		'& > svg': {
			transform: 'rotateY(180deg)',
			transition: (theme) =>
				theme.transitions.create('transform', {
					duration: theme.transitions.duration.shortest,
					easing: theme.transitions.easing.easeInOut,
				}),
		},
		'&[data-rotate=true] > svg': {
			transform: 'rotateY(0deg)',
		},
	},
	navList: {
		flexGrow: 1,
		flexShrink: 1,
		display: 'flex',
		flexDirection: 'column',
		flexWrap: 'nowrap',
		overflow: 'hidden',
		padding: 0,
		'& > :first-of-type': {
			flexGrow: 1,
			flexShrink: 1,
		},
		'& > :last-of-type': {
			flexGrow: 0,
			flexShrink: 0,
		},
	},
	logoutItem: {
		color: 'error.main',
		'& path': {
			color: 'error.main',
			fill: 'currentColor',
		},
	},
	bottomGroup: {
		'& .MuiAccordionSummary-expandIconWrapper': {
			transform: 'rotate(180deg)',
			'&.Mui-expanded': {
				transform: 'none',
			},
		},
	},
} satisfies Mui.SxStyleObj;
