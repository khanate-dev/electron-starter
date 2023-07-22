import { alpha, keyframes } from '@mui/material';

import type { Theme } from '@mui/material';
import type { Mui } from '~/app/types/mui';

export type CxInput = 0 | undefined | false | null | string | CxInput[];

export const cx = (...input: CxInput[]): string => {
	return input
		.map((row) => {
			if (typeof row === 'string') return row;
			if (Array.isArray(row)) return cx(...row);
			return '';
		})
		.filter(Boolean)
		.join(' ');
};

export type CsxInput = 0 | undefined | false | null | Mui.sxProp;

export const csx = (...input: CsxInput[]): Mui.sxProp => {
	const sxArray: unknown[] = [];
	for (const sx of input) {
		if (!sx) continue;
		sxArray.push(...(Array.isArray(sx) ? sx : [sx]));
	}
	return sxArray as Mui.sxProp;
};

export const getOppositeColor = (
	{ palette }: Theme,
	color: Mui.themeColor = 'primary',
) => palette[color][palette.mode === 'light' ? 'dark' : 'light'];

const transitionAnimation = keyframes({
	from: {
		transform: 'translateY(20px)',
		opacity: 0,
	},
});

export const pageTransitionStyles = {
	animationDuration: ({ transitions }) =>
		`${transitions.duration.enteringScreen}ms`,
	animationTimingFunction: ({ transitions }) => transitions.easing.easeInOut,
	animationName: String(transitionAnimation),
} satisfies Mui.sxStyle;

const loadingAnimation = keyframes({
	to: {
		backgroundPositionX: '100%',
	},
});

export const getLoadingStyles = (color: Mui.themeColor): Mui.sxStyle => ({
	color: `${color}.dark`,
	background: ({ palette }) =>
		`repeating-linear-gradient(${[
			'45deg',
			`${alpha(palette[color].light, 0.25)} 0%`,
			`${alpha(palette[color].light, 0.25)} 5%`,
			`${alpha(palette[color].dark, 0.25)} 5%`,
			`${alpha(palette[color].dark, 0.25)} 10%`,
		].join(', ')})`,
	animationDuration: '1s',
	animationTimingFunction: 'linear',
	animationIterationCount: 'infinite',
	animation: String(loadingAnimation),
	backgroundSize: '200% 100%',
	opacity: 0.8,
});
