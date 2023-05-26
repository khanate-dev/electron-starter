import {
	Typography,
	Paper,
	Stack,
	AppBar,
	Toolbar,
	alpha,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { WiMetrixLogo } from '~/app/components/media/wimetrix-logo';
import { BackgroundImage } from '~/app/components/media/background-image';
import { AppLogo } from '~/app/components/media/app-logo';
import { ThemeSwitch } from '~/app/components/controls/theme-switch';
import { LOGIN_HEADER_HEIGHT } from '~/app/config';
import { dayjsUtc } from '~/shared/helpers/date';

const headerLogoSx = {
	width: 'auto',
	height: 'auto',
	maxWidth: 300,
	maxHeight: '70%',
};

export const Example = () => {
	const [val, setVal] = useState<
		{ connected: false } | { connected: true; lastRead?: string; data?: number }
	>({ connected: false });

	useEffect(() => {
		window.ipc.barCodeReader
			.connect()
			.then(() => {
				setVal({ connected: true });
				window.ipc.barCodeReader.listen((data) => {
					setVal((prev) =>
						prev.connected
							? { ...prev, data, lastRead: dayjsUtc().format('h:mm:ss A') }
							: prev
					);
				});
			})
			.catch(console.error);
		return () => {
			window.ipc.barCodeReader.disconnect();
		};
	}, []);

	return (
		<>
			<AppBar
				position='fixed'
				elevation={0}
				sx={{
					zIndex: (theme) => theme.zIndex.drawer + 1,
					transition: (theme) =>
						theme.transitions.create(['width', 'margin'], {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.leavingScreen,
						}),
					background: (theme) => `linear-gradient(
						to left,
						${alpha(theme.palette.secondary[theme.palette.mode], 0.3)},
						${alpha(theme.palette.primary[theme.palette.mode], 0.3)}
					)`,
					height: LOGIN_HEADER_HEIGHT,
					display: 'flex',
					alignItems: 'stretch',
					boxShadow: 'unset',
				}}
			>
				<Stack
					direction='row'
					component={Toolbar}
					sx={{
						height: '100%',
						padding: '0 2em',
						minHeight: '100%',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
					disableGutters
				>
					<AppLogo sx={headerLogoSx} />
					<ThemeSwitch />
					<WiMetrixLogo sx={headerLogoSx} />
				</Stack>
			</AppBar>

			<Stack
				direction='row'
				sx={{
					background: 'background.paper',
					marginTop: `${LOGIN_HEADER_HEIGHT}px`,
					width: '100%',
					height: `calc(100vh - ${LOGIN_HEADER_HEIGHT}px)`,
					overflow: 'hidden',
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					textAlign: 'center',
				}}
			>
				<BackgroundImage />

				<Paper
					sx={{
						width: 0.95,
						height: 'auto',
						maxWidth: 500,
						boxShadow: 3,
						borderRadius: 3,
						marginInline: 'auto',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						flexWrap: 'nowrap',
						alignItems: 'center',
						position: 'relative',
						overflow: 'hidden',
						padding: 5,
						gap: 5,
						'& > form': {
							'& > .MuiGrid-root:first-of-type': {
								gap: 3,
							},
							'& > .MuiGrid-root > .MuiButton-root': {
								width: 1,
								height: 50,
								marginTop: 1,
							},
						},
					}}
				>
					<Typography
						variant='h1'
						color='primary.main'
					>
						Bar Code Reader
					</Typography>

					<Typography
						variant='h2'
						color={val.connected ? 'success.main' : 'error.main'}
					>
						{val.connected ? 'CONNECTED!' : 'DISCONNECTED!'}
					</Typography>
					<Typography
						variant='h4'
						color='primary.main'
					>
						{val.connected && val.data !== undefined
							? val.data
							: 'No Value Read Yet!'}
					</Typography>
					<Typography variant='h4'>
						Last Read On:{' '}
						{val.connected && val.lastRead !== undefined ? val.lastRead : 'N/A'}
					</Typography>

					<WiMetrixLogo
						width={150}
						showPoweredBy
					/>
				</Paper>
			</Stack>
		</>
	);
};
