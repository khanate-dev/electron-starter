import {
	AppBar,
	Chip,
	Paper,
	Stack,
	Toolbar,
	Typography,
	alpha,
} from '@mui/material';
import { useState } from 'react';

import { CustomButton } from '../components/controls/custom-button.component';
import { ThemeSwitch } from '../components/controls/theme-switch.component';
import { CustomAlert } from '../components/feedback/custom-alert.component';
import { AppLogo } from '../components/media/app-logo.component';
import { BackgroundImage } from '../components/media/background-image.component';
import { WiMetrixLogo } from '../components/media/wimetrix-logo.component';
import { LOGIN_HEADER_HEIGHT } from '../constants';
import { useCodeReader } from '../hooks/code-reader.hook';

const headerLogoSx = {
	width: 'auto',
	height: 'auto',
	maxWidth: 300,
	maxHeight: '70%',
};

export const Example = () => {
	const { status, toggleConnection } = useCodeReader();

	const [counter, setCounter] = useState(0);

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
						maxWidth: 450,
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
					<Chip
						sx={{ fontWidth: 'medium' }}
						label={window.ipc.app.env}
					/>

					<Stack sx={{ gap: 1, alignItems: 'center', maxWidth: '100%' }}>
						<Typography
							variant='h3'
							color='primary.main'
						>
							Bar Code Reader
						</Typography>

						<Stack sx={{ flexDirection: 'row', gap: 1 }}>
							<Chip
								color={
									status.type === 'error'
										? 'error'
										: status.type === 'connected'
										? 'success'
										: 'warning'
								}
								label={
									status.type === 'connecting'
										? 'CONNECTING...'
										: status.type === 'disconnecting'
										? 'DISCONNECTING!'
										: status.type === 'connected'
										? 'CONNECTED!'
										: 'NOT CONNECTED!'
								}
							/>
							<CustomButton
								label={status.type === 'connected' ? 'disconnect' : 'connect'}
								color={status.type === 'connected' ? 'error' : 'success'}
								isBusy={
									status.type === 'connecting' ||
									status.type === 'disconnecting'
								}
								onClick={toggleConnection}
							/>
						</Stack>

						{status.type === 'connected' && (
							<>
								<Typography
									variant='h6'
									color='primary.main'
								>
									Read Value: {status.reading?.data ?? 'N/A'}
								</Typography>
								<Typography variant='h6'>
									Read On: {status.reading?.at ?? 'N/A'}
								</Typography>
							</>
						)}

						{status.type === 'error' && (
							<CustomAlert
								message={status.message}
								severity='error'
								sx={{ maxWidth: '100%' }}
							/>
						)}
					</Stack>

					<CustomButton
						label={`Click Me! ${counter}`}
						onClick={() => {
							setCounter(counter + 1);
						}}
					/>

					<WiMetrixLogo
						width={150}
						showPoweredBy
					/>
				</Paper>
			</Stack>
		</>
	);
};
