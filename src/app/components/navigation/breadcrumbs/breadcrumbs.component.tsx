import { useLocation, NavLink } from 'react-router-dom';
import { Box, Breadcrumbs as MuiBreadcrumbs, Typography } from '@mui/material';
import { HomeRounded } from '@mui/icons-material';

import { humanizeToken } from '~/shared/helpers/string';
import { AppIcon } from '~/app/components/media/app-icon';

import { breadcrumbsStyles as styles } from './breadcrumbs.styles';

type BaseCrumbProps = {
	to?: string;
	sx: Mui.SxStyle;
	children: React.Node;
};
type CrumbProps =
	| ({ to?: undefined } & BaseCrumbProps)
	| ({ to: string } & BaseCrumbProps);

const Crumb = (props: CrumbProps) => {
	switch (props.to) {
		case undefined:
			return <Typography {...props} />;
		default:
			return (
				<Box
					component={NavLink}
					{...props}
				/>
			);
	}
};

export const Breadcrumbs = () => {
	const { pathname } = useLocation();

	const pathnames = pathname
		.split('/')
		.filter((chunk) => chunk && isNaN(Number(chunk)));

	return (
		<MuiBreadcrumbs sx={styles.container}>
			{pathnames.length > 0 && (
				<Crumb
					sx={styles.crumb}
					to='/'
				>
					<HomeRounded />
				</Crumb>
			)}
			{pathnames.map((name, index) => (
				<Crumb
					key={index}
					sx={styles.crumb}
					to={
						index !== pathnames.length - 1
							? `/${pathnames.slice(0, index + 1).join('/')}`
							: undefined
					}
				>
					{index === 0 && <AppIcon name={name as never} />}
					{humanizeToken(name)}
				</Crumb>
			))}
		</MuiBreadcrumbs>
	);
};
