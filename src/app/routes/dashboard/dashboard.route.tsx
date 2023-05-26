import { Outlet, redirect, useLoaderData } from 'react-router-dom';
import { Box, Stack, Toolbar, AppBar } from '@mui/material';

import { UserProvider } from '~/app/contexts/user';
import { Sidebar } from '~/app/components/panels/sidebar';
import { Breadcrumbs } from '~/app/components/navigation/breadcrumbs';
import { WiMetrixLogo } from '~/app/components/media/wimetrix-logo';
import { ThemeSwitch } from '~/app/components/controls/theme-switch';
import { UserProfile } from '~/app/components/app/user-profile';
import { getSetting } from '~/app/helpers/settings';

import { homeStyles as styles } from './dashboard.styles';

import type { LoggedInUser } from '~/app/schemas/user';

const loader = () => {
	const user = getSetting('user');
	if (!user) return redirect('/login');
	return user;
};

export const Dashboard = () => {
	const user = useLoaderData() as LoggedInUser;
	return (
		<UserProvider user={user}>
			<Sidebar />

			<Box sx={styles.container}>
				<AppBar
					position='relative'
					sx={styles.header}
					elevation={0}
				>
					<Stack
						direction='row'
						sx={styles.toolbar}
						component={Toolbar}
						disableGutters
					>
						<Breadcrumbs />

						<WiMetrixLogo sx={styles.logo} />

						<ThemeSwitch />

						<UserProfile />
					</Stack>
				</AppBar>

				<Box
					className='scroll-y'
					sx={styles.main}
					component='main'
				>
					<Outlet />
				</Box>
			</Box>
		</UserProvider>
	);
};

Dashboard.loader = loader;
