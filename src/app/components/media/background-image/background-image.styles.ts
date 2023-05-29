import { lighten, darken, alpha } from '@mui/material';

import type { BackgroundImageProps } from './background-image.component';

export const getBackgroundImageStyles = (
	opacity: BackgroundImageProps['opacity']
) => {
	const offsets = {
		light: {
			more: 0.6,
			slight: 0.3,
		},
		dark: {
			more: 0.8,
			slight: 0.4,
		},
	};

	return {
		svg: {
			width: 'auto',
			height: 'min(95%, 600px)',
			position: 'absolute',
			bottom: 0,
			left: -50,
			opacity: opacity ?? 0.8,
		},
		foreground: {
			fill: ({ palette }) => palette.background.paper,
		},
		background: {
			fill: ({ palette }) => alpha(palette.primary.light, 0.3),
		},
		primaryLighter: {
			fill: ({ palette }) =>
				lighten(palette.primary.main, offsets[palette.mode].more),
		},
		primaryLight: {
			fill: ({ palette }) =>
				lighten(palette.primary.main, offsets[palette.mode].slight),
		},
		primaryRegular: {
			fill: ({ palette }) => palette.primary.main,
		},
		primaryDark: {
			fill: ({ palette }) =>
				darken(palette.primary.main, offsets[palette.mode].slight),
		},
		primaryDarker: {
			fillRule: 'evenodd',
			fill: ({ palette }) =>
				darken(palette.primary.main, offsets[palette.mode].more),
		},
		secondaryLighter: {
			fill: ({ palette }) =>
				darken(palette.secondary.main, offsets[palette.mode].more),
		},
		secondaryLight: {
			fill: ({ palette }) =>
				lighten(palette.secondary.light, offsets[palette.mode].slight),
		},
		secondaryRegular: {
			fill: ({ palette }) => palette.secondary.light,
		},
		secondaryDark: {
			fill: ({ palette }) =>
				darken(palette.secondary.main, offsets[palette.mode].slight),
		},
		secondaryDarker: {
			fillRule: 'evenodd',
			fill: ({ palette }) =>
				darken(palette.secondary.main, offsets[palette.mode].more),
		},
	} satisfies Mui.SxStyleObj;
};
