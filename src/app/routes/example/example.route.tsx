import {
	AppBar,
	Paper,
	Stack,
	Toolbar,
	Typography,
	alpha,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { CustomButton } from '~/app/components/controls/custom-button.component';
import { ThemeSwitch } from '~/app/components/controls/theme-switch.component';
import { AppLogo } from '~/app/components/media/app-logo.component';
import { BackgroundImage } from '~/app/components/media/background-image.component';
import { WiMetrixLogo } from '~/app/components/media/wimetrix-logo.component';
import { LOGIN_HEADER_HEIGHT } from '~/app/constants';
import { stringifyError } from '~/shared/errors';
import { dayjsUtc } from '~/shared/helpers/date.helpers';

const headerLogoSx = {
	width: 'auto',
	height: 'auto',
	maxWidth: 300,
	maxHeight: '70%',
};

export const Example = () => {
	const [val, setVal] = useState<
		| { type: 'error'; message: string }
		| { type: 'connecting' }
		| { type: 'connected'; reading?: { at: string; data: number } }
	>({ type: 'connecting' });
	const [counter, setCounter] = useState(0);

	useEffect(() => {
		window.ipc.barCode
			.connect()
			.then(() => {
				setVal({ type: 'connected' });
			})
			.catch((error) => {
				setVal({ type: 'error', message: stringifyError(error) });
			});

		window.ipc.barCode.listen((data) => {
			setVal((prev) =>
				prev.type === 'connected'
					? {
							...prev,
							reading: { data, at: dayjsUtc().format('h:mm:ss A') },
					  }
					: prev,
			);
		});

		return () => {
			window.ipc.barCode.disconnect().catch(() => false);
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
						variant='h2'
						color='primary.main'
					>
						Bar Code Reader
					</Typography>

					<Typography
						variant='h3'
						color={val.type === 'error' ? 'error.main' : 'success.main'}
					>
						{val.type === 'connecting'
							? 'CONNECTING...'
							: val.type === 'connected'
							? 'CONNECTED!'
							: 'DISCONNECTED!'}
					</Typography>
					{val.type === 'connected' && (
						<>
							<Typography
								variant='h4'
								color='primary.main'
							>
								{val.reading ? val.reading.data : 'No Value Read Yet!'}
							</Typography>
							<Typography variant='h4'>
								Last Read On: {val.reading ? val.reading.at : 'N/A'}
							</Typography>
						</>
					)}

					{val.type === 'error' && (
						<Typography sx={{ '& > code': { backgroundColor: '#8882' } }}>
							<code>{val.message}</code>
						</Typography>
					)}

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
