import { forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';

import { humanizeToken } from '~/shared/helpers/string';

import type { Ref } from 'react';
import type { LinkProps } from '@mui/material';

export type AppLinkProps = {
	/** the relative route for this link */
	to: string;

	/** the label of the link */
	label?: React.Node;
} & LinkProps;

export const AppLink = forwardRef(
	(
		{ sx, to, label, children, ...linkProps }: AppLinkProps,
		ref: Ref<HTMLAnchorElement>
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
	}
);

AppLink.displayName = 'AppLink';
