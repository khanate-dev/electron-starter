import { alpha, darken, lighten } from '@mui/material';

import { getOppositeColor } from '~/app/helpers/style';

import type { Theme } from '@mui/material';

const sharedStyles: Mui.SxStyle = {
	backgroundColor: ({ palette }) => alpha(palette.primary[palette.mode], 0.3),
	borderWidth: 2,
	borderStyle: 'solid',
	borderColor: ({ palette }) => `primary.${palette.mode}`,
	borderRadius: 1,
	color: getOppositeColor,
	transition: (theme) =>
		theme.transitions.create(['border', 'background-color']),
};

const sharedHoverStyles: Mui.SxStyle = {
	backgroundColor: ({ palette }) => alpha(palette.primary[palette.mode], 0.6),
	borderColor: 'primary.main',
};

const sharedFocusStyles: Mui.SxStyle = {
	backgroundColor: ({ palette }) => alpha(palette.primary[palette.mode], 0.7),
	borderColor: getOppositeColor,
};

const getScrollbarBack = ({ palette }: Theme) => {
	return palette.mode === 'light'
		? lighten(palette.primary.light, 0.8)
		: darken(palette.primary.dark, 0.3);
};

const getScrollbarThumb = ({ palette }: Theme) => {
	return palette.mode === 'light'
		? lighten(palette.primary.light, 0.2)
		: darken(palette.primary.dark, 0.2);
};

export const getOptionPanelStyles = (isMinimized: boolean) =>
	({
		container: {
			flexDirection: 'row',
			height: '100%',
			display: 'flex',
			flexWrap: 'nowrap',
			alignItems: 'stretch',
			gap: 1,
		},
		panel: {
			width: isMinimized ? 50 : 250,
			flexGrow: 0,
			flexShrink: 0,
			flexDirection: 'column',
			flexWrap: 'nowrap',
			gap: 1,
			backgroundColor: 'background.default',
			borderWidth: 2,
			borderStyle: 'solid',
			borderColor: 'divider',
			borderRadius: 1,
			padding: 1,
			transition: (theme) => theme.transitions.create('width'),
			overflow: 'hidden',
			position: 'relative',

			'> :not(button)': {
				transition: (theme) => theme.transitions.create(['width', 'height']),
				width: '100%',
			},
		},
		minimized: {
			'> :not(button:first-of-type)': {
				width: '0',

				'&.MuiButtonBase-root': {
					borderWidth: 0,
					'&::before, &::after': {
						width: 0,
					},
				},
			},
		},
		button: {
			...sharedStyles,
			aspectRatio: '1',
			'&:hover': {
				...sharedHoverStyles,
			},
			'&:focus-visible': {
				...sharedFocusStyles,
			},
		},
		minimizeButton: {
			width: '100%',
			height: 'auto',
			aspectRatio: '1',
			maxWidth: 30,
			fontSize: 30,
			marginInline: 'auto',
		},
		controls: {
			display: 'flex',
			width: '100%',
			flexGrow: 0,
			flexShrink: 0,
			flexDirection: 'column',
			flexWrap: 'nowrap',
			justifyContent: 'center',
			gap: 1,
			height: 80,
			overflow: 'hidden',
		},
		noPagination: {
			height: 50,
		},
		controlsHidden: {
			height: 0,
		},
		searchField: {
			flexGrow: 1,
			minWidth: 'unset',
			maxWidth: 'unset',
			...sharedStyles,
			'&:hover': {
				...sharedHoverStyles,
			},
			'&:focus-within': {
				...sharedFocusStyles,
			},
		},
		pagination: {
			width: '100%',
			flexWrap: 'nowrap',
			'&  ul': {
				width: '100%',
				gap: 0.5,
				flexWrap: 'nowrap',
				justifyContent: 'center',
				alignItems: 'stretch',
				'& .MuiButtonBase-root, & .MuiPaginationItem-ellipsis': {
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					fontWeight: 'medium',
					fontSize: '0.9em',
					color: 'primary.dark',
					flexGrow: 1,
					flexShrink: 1,
					aspectRatio: '1',
					...sharedStyles,

					'&.MuiButtonBase-root': {
						'&:hover': {
							...sharedHoverStyles,
						},
						'&:focus-visible': {
							...sharedFocusStyles,
						},
						'&.Mui-selected': {
							backgroundColor: getOppositeColor,
							borderColor: getOppositeColor,
							color: 'primary.contrastText',
						},
					},
					'&.MuiPaginationItem-ellipsis': {
						fontSize: '1.3em',
						opacity: 0.5,
					},
				},
			},
		},
		controlsMinimize: {
			width: 20,
			height: 20,
			marginInline: 'auto',
			padding: 0,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 1,
			zIndex: 1,
			position: 'unset',
			'::before, ::after': {
				content: '""',
				width: 'calc(40% - 5px)',
				height: 2,
				backgroundColor: 'divider',
				position: 'absolute',
				borderRadius: 1,
				zIndex: -1,
			},
			'::before': {
				left: '5%',
			},
			'::after': {
				right: '5%',
			},
			'& svg': {
				width: '100%',
				height: '100%',
			},
			...sharedStyles,
		},
		options: {
			flexWrap: 'nowrap',
			gap: 1,
			width: '100%',
			'&::-webkit-scrollbar': {
				backgroundColor: getScrollbarBack,
				height: 5,
				width: 5,
			},
			'&::-webkit-scrollbar-thumb': {
				backgroundColor: getScrollbarThumb,
			},
			'&.scroll-y': {
				scrollbarColor: (theme) =>
					`${getScrollbarThumb(theme)} ${getScrollbarBack(theme)}`,
			},
		},
		optionItem: {
			width: '100%',
			lineHeight: 1.2,
			cursor: 'grab',
			display: 'flex',
			flexDirection: 'column',
			flexWrap: 'nowrap',
			padding: 0.5,
			gap: 0.5,
			...sharedStyles,
			'&:hover': {
				...sharedHoverStyles,
			},
			'&:focus-visible': {
				...sharedFocusStyles,
			},
		},
		labelRow: {
			width: '100%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			gap: '5px',
			'> *': {
				fontSize: '1.2em',
			},
		},
		labelTitle: {
			paddingInline: 1,
			backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.3),
			borderRadius: 0.5,
			fontWeight: 'medium',
			flexShrink: 0,
		},
		labelValue: {
			flexGrow: 1,
			flexShrink: 1,
			overflow: 'hidden',
			whiteSpace: 'nowrap',
			textOverflow: 'ellipsis',
		},
		main: {
			display: 'flex',
			flexDirection: 'column',
			flexWrap: 'nowrap',
			flexGrow: 1,
			flexShrink: 1,
			gap: 1,
			overflow: 'hidden',
		},
	} satisfies Mui.SxStyleObj);
