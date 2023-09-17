import { Link } from '@mui/material';
import { forwardRef } from 'react';
import { NavLink } from 'react-router-dom';

import { humanizeToken } from '~/shared/helpers/humanize-token.helpers';

import type { LinkProps } from '@mui/material';
import type { ElementRef, ReactNode, Ref } from 'react';

export type AppLinkProps = LinkProps & {
	/** the relative route for this link */
	to: string;

	/** the label of the link */
	label?: ReactNode;
};

const AppLinkInner = (
	{ to, label, children, ...linkProps }: AppLinkProps,
	ref: Ref<ElementRef<typeof Link>>,
) => {
	return (
		<Link
			ref={ref}
			underline='none'
			color='text.primary'
			component={NavLink}
			to={to}
			{...linkProps}
		>
			{children ?? label ?? humanizeToken(to.replace(/\//gu, ' ').trim())}
		</Link>
	);
};

export const AppLink = forwardRef(AppLinkInner);
