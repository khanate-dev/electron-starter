import { redirect, useNavigate } from 'react-router-dom';
import {
	Typography,
	Paper,
	Stack,
	AppBar,
	Toolbar,
	alpha,
} from '@mui/material';

import { FormSchema } from '~/app/schemas';
import { userZodSchema } from '~/app/schemas/user';
import { login } from '~/app/endpoints/user';
import { getSetting, setSetting } from '~/app/helpers/settings';
import { WiMetrixLogo } from '~/app/components/media/wimetrix-logo';
import { BackgroundImage } from '~/app/components/media/background-image';
import { SchemaForm } from '~/app/components/forms/schema-form';
import { AppLogo } from '~/app/components/media/app-logo';
import { ThemeSwitch } from '~/app/components/controls/theme-switch';
import { LOGIN_HEADER_HEIGHT } from '~/app/config';

const loginSchema = new FormSchema({
	name: 'login',
	zod: userZodSchema.pick({ userName: true, password: true }),
	fields: {
		userName: { type: 'string' },
		password: { type: 'string' },
	},
});

const headerLogoSx = {
	width: 'auto',
	height: 'auto',
	maxWidth: 300,
	maxHeight: '70%',
};

const loader = () => {
	const user = getSetting('user');
	if (user) return redirect('/');
	return null;
};

export const Login = () => {
	const navigate = useNavigate();

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
				}}
			>
				<BackgroundImage />

				<Paper
					sx={{
						width: 0.95,
						height: 'auto',
						maxWidth: 350,
						boxShadow: 3,
						borderRadius: 3,
						marginInline: 'auto 15%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						flexWrap: 'nowrap',
						alignItems: 'center',
						position: 'relative',
						overflow: 'hidden',
						padding: 4,
						gap: 4,
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
						color='primary'
					>
						Login
					</Typography>

					<SchemaForm
						schema={loginSchema}
						isUpdate={false}
						onSubmit={async (data) => {
							const user = await login(data);
							setSetting('user', user);
							setTimeout(() => {
								navigate('/');
							}, 500);
							return 'login successful! redirecting...';
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

Login.loader = loader;
