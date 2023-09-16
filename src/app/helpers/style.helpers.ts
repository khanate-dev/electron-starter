import { alpha, keyframes } from '@mui/material';

import type { Theme } from '@mui/material';
import type { Mui } from '~/app/types/mui.types';

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

export const pageTransitionStyles = {
	animationDuration: ({ transitions }) =>
		`${transitions.duration.enteringScreen}ms`,
	animationTimingFunction: ({ transitions }) => transitions.easing.easeInOut,
	animationName: keyframes({
		from: { transform: 'translateY(20px)', opacity: 0 },
	}).toString(),
} satisfies Mui.sxStyle;

export const getLoadingStyles = (color: Mui.themeColor) => {
	return {
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
		animation: keyframes({ to: { backgroundPositionX: '100%' } }).toString(),
		backgroundSize: '200% 100%',
		opacity: 0.8,
	} satisfies Mui.sxStyle;
};

export const wrappedTextStyle = {
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
} satisfies Mui.sxStyle;

export const scrollStyles = {
	x: { overflowX: 'auto', overflowY: 'hidden', flexWrap: 'nowrap' },
	y: { overflowX: 'hidden', overflowY: 'auto', flexWrap: 'nowrap' },
	xy: { overflowX: 'auto', overflowY: 'auto', flexWrap: 'nowrap' },
} satisfies Mui.sxStyleObj;
