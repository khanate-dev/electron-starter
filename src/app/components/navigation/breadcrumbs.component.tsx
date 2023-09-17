import { HomeOutlined as HomeIcon } from '@mui/icons-material';
import { Box, Breadcrumbs as MuiBreadcrumbs, keyframes } from '@mui/material';
import { useLocation } from 'react-router-dom';

import { AppLink } from '~/app/components/navigation/app-link.component';
import { humanizeToken } from '~/shared/helpers/humanize-token.helpers';

import type { Mui } from '~/app/types/mui.types';

export const Breadcrumbs = () => {
	const { pathname } = useLocation();

	const pathnames = pathname
		.split('/')
		.filter((chunk) => chunk && isNaN(Number(chunk)));

	const animationStyles = {
		animationDuration: ({ transitions }) =>
			`${transitions.duration.shortest}ms`,
		animationTimingFunction: ({ transitions }) => transitions.easing.sharp,
		animationName: keyframes({
			from: { transform: 'translateX(-20px)', opacity: 0 },
			to: { transform: 'translateX(0)', opacity: 1 },
		}).toString(),
	} satisfies Mui.sxStyle;

	const linkStyles = {
		transition: ({ transitions }) => transitions.create('transform'),
		'&:hover, &:focus': { transform: 'scale(0.9)' },
		'& > .MuiLink-root': {
			lineHeight: 1,
			color: 'inherit',
			padding: 0,
		},
	} satisfies Mui.sxStyle;

	return (
		<MuiBreadcrumbs
			sx={{
				fontSize: '1em',
				fontWeight: 'medium',
				'& > .MuiBreadcrumbs-ol': {
					alignItems: 'stretch',
					'& > .MuiBreadcrumbs-separator': {
						alignItems: 'center',
						marginInline: 0.5,
						...animationStyles,
					},
					'& > .MuiBreadcrumbs-li > *': {
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						paddingInline: 1,
						paddingBlock: 0.5,
						borderRadius: 1,
						backgroundColor: 'background.default',
						color: 'text.secondary',
						...animationStyles,
					},
				},
			}}
		>
			{pathnames.length > 0 && (
				<Box sx={linkStyles}>
					<AppLink
						to='/'
						label={<HomeIcon />}
					/>
				</Box>
			)}
			{pathnames.map((to, index) => (
				<Box
					key={to}
					sx={index !== pathnames.length - 1 ? linkStyles : undefined}
				>
					{index === pathnames.length - 1 ? (
						humanizeToken(to)
					) : (
						<AppLink to={to} />
					)}
				</Box>
			))}
		</MuiBreadcrumbs>
	);
};
