import { Divider, Stack } from '@mui/material';
import { Outlet, redirect } from 'react-router-dom';

import { UserProfile } from '~/components/app/user-profile.component';
import { CustomButton } from '~/components/controls/custom-button.component';
import { ThemeControl } from '~/components/controls/theme-control.component';
import { AppIcon } from '~/components/media/app-icon.component';
import { AppLogo } from '~/components/media/app-logo.component';
import { WiMetrixLogo } from '~/components/media/wimetrix-logo.component';
import { Breadcrumbs } from '~/components/navigation/breadcrumbs.component';
import { Sidebar } from '~/components/panels/sidebar.component';
import { scrollStyles } from '~/helpers/style.helpers';
import { toggleSidebar, useSidebar } from '~/hooks/sidebar.hook';
import { UserProvider, userStore } from '~/hooks/user.hook';

const headerHeight = 60;

const loader = () => {
	const user = userStore.get();
	if (!user) return redirect('/login');
	return null;
};

export const Dashboard = () => {
	const { isMinimized } = useSidebar();
	return (
		<UserProvider>
			<Stack
				component={'header'}
				sx={{
					flexDirection: 'row',
					alignItems: 'center',
					backgroundColor: 'background.paper',
					width: '100%',
					height: headerHeight,
					borderBottomStyle: 'solid',
					borderBottomWidth: 2,
					paddingLeft: 1,
					borderBottomColor: 'divider',
					gap: 1,
				}}
			>
				<CustomButton
					icon={<AppIcon name='toggle-sidebar' />}
					label='toggle sidebar'
					tooltip={false}
					sx={{
						height: '70%',
						padding: 1,
						aspectRatio: '1',
						borderRadius: 1,
						'& > svg': {
							transform: `rotateY(${isMinimized ? 0 : 180}deg)`,
							transition: (theme) => theme.transitions.create('transform'),
						},
					}}
					isIcon
					onClick={toggleSidebar}
				/>

				<Stack
					sx={{
						flexDirection: 'row',
						alignItems: 'flex-end',
						height: '50%',
						gap: 1,
					}}
				>
					<AppLogo height={'100%'} />
					<Divider orientation='vertical' />
					<WiMetrixLogo
						height={'70%'}
						showPoweredBy
					/>
				</Stack>

				<Breadcrumbs sx={{ marginInline: 'auto' }} />

				<ThemeControl />
				<UserProfile />
			</Stack>

			<Sidebar sx={{ height: `calc(100% - ${headerHeight}px)` }} />

			<Stack
				component='main'
				sx={{
					height: `calc(100% - ${headerHeight}px)`,
					flex: 1,
					...scrollStyles.y,
				}}
			>
				<Outlet />
			</Stack>
		</UserProvider>
	);
};

Dashboard.loader = loader;
