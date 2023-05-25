import { Outlet } from 'react-router-dom';
import { Box, Stack, Toolbar, AppBar } from '@mui/material';

import { UserProvider } from '~/app/contexts/user';
import { Sidebar } from '~/app/components/panels/sidebar';
import { Breadcrumbs } from '~/app/components/navigation/breadcrumbs';
import { WiMetrixLogo } from '~/app/components/media/wimetrix-logo';
import { ThemeSwitch } from '~/app/components/controls/theme-switch';
import { UserProfile } from '~/app/components/app/user-profile';

import { homeStyles as styles } from './dashboard.styles';

export const Dashboard = () => {
	return (
		<UserProvider>
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
