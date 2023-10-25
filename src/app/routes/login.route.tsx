import { Paper } from '@mui/material';
import { redirect, useNavigate } from 'react-router-dom';

import { FormSchema } from '~/classes/form-schema.class';
import { ThemeControl } from '~/components/controls/theme-control.component';
import { SchemaForm } from '~/components/forms/schema-form.component';
import { AppLogo } from '~/components/media/app-logo.component';
import { BackgroundImage } from '~/components/media/background-image.component';
import { WiMetrixLogo } from '~/components/media/wimetrix-logo.component';
import { login } from '~/endpoints/user.endpoints';
import { scrollStyles } from '~/helpers/style.helpers';
import { useDocTitle } from '~/hooks/doc-title.hook';
import { userStore } from '~/hooks/user.hook';
import { loginSchema } from '~/schemas/user.schema';

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
	const user = userStore.get();
	if (user !== null) return redirect('/');
	return null;
};

export const Login = () => {
	const navigate = useNavigate();
	useDocTitle('Login');
	return (
		<>
			<BackgroundImage />

			<ThemeControl sx={{ position: 'absolute', top: '15px', right: '15px' }} />

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
						fieldOuterContainer: { padding: 0 },
						button: { minWidth: 150 },
					}}
					onSubmit={async (data) => {
						const user = await login(data);
						setTimeout(() => {
							userStore.set(user);
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
