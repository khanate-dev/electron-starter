import { alpha } from '@mui/material';

import type { GeneralDialogProps } from './general-dialog.component';

export const getGeneralDialogStyles = ({
	accent = 'primary',
}: Pick<GeneralDialogProps, 'accent'>) =>
	({
		dialogContainer: {
			backgroundColor: 'background.paper',
			borderRadius: 2,
		},
		title: {
			backgroundColor: `${accent}.main`,
			color: `${accent}.contrastText`,
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			padding: 2,
			'& + .MuiDialogContent-root': {
				paddingTop: (theme) => `${theme.spacing(2)} !important`,
			},
		},
		titleLabel: {
			flexGrow: 1,
			overflow: 'hidden',
			fontWeight: 'medium',
			whiteSpace: 'nowrap',
			textOverflow: 'ellipsis',
			textTransform: 'capitalize',
		},
		titleClose: {
			flexGrow: 0,
			padding: 0,
			'& svg': {
				width: 30,
				height: 30,
				transition: (theme) =>
					theme.transitions.create(['width', 'height'], {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.shortest,
					}),
			},
			color: `${accent}.contrastText`,
			position: 'relative',
			zIndex: 1,
			'&::before': {
				content: '""',
				borderRadius: '50%',
				backgroundColor: (theme) => alpha(theme.palette.common.black, 0.1),
				position: 'absolute',
				width: 0,
				height: 0,
				zIndex: -1,
				transition: (theme) =>
					theme.transitions.create(['width', 'height'], {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.shortest,
					}),
			},
			'&:hover': {
				'&::before': {
					width: '175%',
					height: '175%',
				},
			},
		},
		titleCloseTooltip: {
			backgroundColor: `${accent}.main`,
			color: `${accent}.contrastText`,
		},
		content: {
			flexGrow: 1,
			margin: 0,
			padding: 2,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			alignItems: 'center',
			flexWrap: 'nowrap',
			gap: 2,
			'&:not(.scroll-x):not(.scroll-y):not(.scroll-xy)': {
				overflow: 'hidden',
			},
			minHeight: 100,
		},
		actions: {
			margin: 0,
			padding: 2,
			alignItems: 'stretch',
			justifyContent: 'center',
		},
		action: {
			fontSize: '1.3em',
			borderRadius: 3,
			flexGrow: 1,
			flexShrink: 1,
			flexBasis: 1,
			maxWidth: 200,
			padding: '10px 20px',
			lineHeight: 1.2,
		},
	} satisfies Mui.SxStyleObj);
