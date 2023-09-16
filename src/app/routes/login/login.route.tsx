import { Paper } from '@mui/material';
import { redirect, useNavigate } from 'react-router-dom';

import { FormSchema } from '~/app/classes/form-schema.class';
import { ThemeSwitch } from '~/app/components/controls/theme-switch.component';
import { SchemaForm } from '~/app/components/forms/schema-form.component';
import { AppLogo } from '~/app/components/media/app-logo.component';
import { BackgroundImage } from '~/app/components/media/background-image.component';
import { WiMetrixLogo } from '~/app/components/media/wimetrix-logo.component';
import { login } from '~/app/endpoints/user.endpoints';
import { scrollStyles } from '~/app/helpers/style.helpers';
import { useDocTitle } from '~/app/hooks/doc-title.hook';
import { setLocalStorageUser } from '~/app/hooks/user.hook';
import { loginSchema } from '~/app/schemas/user.schema';

const schema = new FormSchema({
	name: 'user',
	zod: loginSchema,
	fields: {
		UserName: {
			type: 'string',
			inputProps: {
				pattern: '.*\\S.*',
				title: 'Can not be empty',
			},
		},
		Password: { type: 'string', isSecret: true },
	},
});

const loader = () => {
	const user = localStorage.getItem('user');
	if (user !== null) return redirect('/');
	return null;
};

export const Login = () => {
	const navigate = useNavigate();
	useDocTitle('Login');
	return (
		<>
			<BackgroundImage />

			<ThemeSwitch sx={{ position: 'absolute', top: '15px', right: '15px' }} />

			<Paper
				sx={{
					height: 'auto',
					width: 0.95,
					maxWidth: 350,
					boxShadow: 3,
					borderRadius: 3,
					margin: 'auto 5% auto auto',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'relative',
					padding: 4,
					...scrollStyles.y,
				}}
			>
				<AppLogo sx={{ width: 250, marginBottom: 4 }} />

				<SchemaForm
					schema={schema}
					isUpdate={false}
					submitLabel='login'
					styles={{
						fieldOuterContainer: { margin: 0 },
						button: { minWidth: 150, height: 40 },
					}}
					onSubmit={async (data) => {
						const user = await login(data);
						setTimeout(() => {
							setLocalStorageUser(user);
							navigate('/');
						}, 1250);
						return {
							type: 'success',
							message: 'logged in! redirecting...',
							ephemeral: true,
							duration: 1000,
						};
					}}
				/>

				<WiMetrixLogo
					sx={{ width: 150, marginTop: 4 }}
					showPoweredBy
				/>
			</Paper>
		</>
	);
};

Login.loader = loader;
