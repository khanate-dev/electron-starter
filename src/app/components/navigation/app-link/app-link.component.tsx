import { Link } from '@mui/material';
import { forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

import { humanizeToken } from '~/shared/helpers/string';

import type { LinkProps } from '@mui/material';
import type { ReactNode, Ref } from 'react';

export type AppLinkProps = {
	/** the relative route for this link */
	to: string;

	/** the label of the link */
	label?: ReactNode;
} & LinkProps;

export const AppLink = forwardRef(
	(
		{ sx, to, label, children, ...linkProps }: AppLinkProps,
		ref: Ref<HTMLAnchorElement>,
	) => {
		return (
			<Link
				ref={ref}
				sx={sx}
				underline='none'
				color='text.primary'
				component={RouterLink}
				to={to}
				{...linkProps}
			>
				{children ?? label ?? humanizeToken(to.replace(/\//gu, ' ').trim())}
			</Link>
		);
	},
);

AppLink.displayName = 'AppLink';
