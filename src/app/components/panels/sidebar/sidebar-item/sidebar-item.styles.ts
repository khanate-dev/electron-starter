export const sidebarItemStyles = {
	tooltip: {
		padding: '5px 15px',
	},
	listItem: {
		color: 'text.primary',
		position: 'relative',
		transition: (theme) =>
			theme.transitions.create(['padding', 'width'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.shortest,
			}),
		'&::before': {
			content: '""',
			display: 'block',
			position: 'absolute',
			top: 0,
			left: 0,
			height: '100%',
			width: 0,
			borderTopRightRadius: 5,
			borderBottomRightRadius: 5,
			backgroundColor: 'primary.main',
			transition: (theme) =>
				theme.transitions.create('width', {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.shortest,
				}),
		},
		'.active > &': {
			color: 'primary.main',
			'& path': {
				fill: (theme) => theme.palette.primary.main,
			},
			'&::before': {
				width: 8,
			},
		},
	},
	listIcon: {
		transition: 'width 0.2s linear',
		minWidth: 'unset',
		width: 25,
		marginRight: 2,
		justifyContent: 'center',
		'& svg': {
			width: 25,
			maxHeight: 25,
		},
		'& path': {
			fill: ({ palette }) => palette.text.secondary,
		},
	},
	listName: {
		textTransform: 'capitalize',
		overflow: 'hidden',
		'& > span': {
			overflow: 'hidden',
			whiteSpace: 'nowrap',
			textOverflow: 'ellipsis',
		},
	},
} satisfies Mui.SxStyleObj;
