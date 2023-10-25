import { AppBar, Stack, Toolbar } from '@mui/material';
import { Outlet, redirect } from 'react-router-dom';

import { UserProfile } from '../../components/app/user-profile.component';
import { ThemeSwitch } from '../../components/controls/theme-switch.component';
import { WiMetrixLogo } from '../../components/media/wimetrix-logo.component';
import { Breadcrumbs } from '../../components/navigation/breadcrumbs.component';
import { Sidebar } from '../../components/panels/sidebar.component';
import { APP_HEADER_HEIGHT } from '../../constants';
import { scrollStyles } from '../../helpers/style.helpers';
import { UserProvider, getLocalStorageUser } from '../../hooks/user.hook';

const loader = () => {
	const user = getLocalStorageUser();
	if (!user) return redirect('/login');
	return null;
};

export const Dashboard = () => {
	return (
		<UserProvider>
			<Sidebar />

			<Stack sx={{ flex: 1, overflow: 'hidden' }}>
				<AppBar
					position='relative'
					elevation={0}
					color='transparent'
					sx={{
						backgroundColor: 'background.paper',
						height: APP_HEADER_HEIGHT,
					}}
				>
					<Stack
						direction='row'
						component={Toolbar}
						sx={{
							height: APP_HEADER_HEIGHT,
							minHeight: `${APP_HEADER_HEIGHT}px !important`,
							paddingRight: 1,
							paddingLeft: `${APP_HEADER_HEIGHT + 5}px`,
							position: 'relative',
							alignItems: 'center',
							gap: 1,
							borderBottom: 2,
							borderBottomStyle: 'solid',
							borderBottomColor: 'divider',
							'& > .MuiBreadcrumbs-root': { marginRight: 'auto' },
						}}
						disableGutters
					>
						<Breadcrumbs />
						<WiMetrixLogo
							width={130}
							sx={{ position: 'absolute', left: 'calc(50% - 65px)' }}
						/>
						<ThemeSwitch />
						<UserProfile />
					</Stack>
				</AppBar>

				<Stack
					component='main'
					flex={1}
					sx={scrollStyles.y}
				>
					<Outlet />
				</Stack>
			</Stack>
		</UserProvider>
	);
};

Dashboard.loader = loader;
