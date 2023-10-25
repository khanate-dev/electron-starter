import { Chip, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { CustomButton } from '~/components/controls/custom-button.component';
import { ThemeControl } from '~/components/controls/theme-control.component';
import { CustomAlert } from '~/components/feedback/custom-alert.component';
import { AppLogo } from '~/components/media/app-logo.component';
import { BackgroundImage } from '~/components/media/background-image.component';
import { WiMetrixLogo } from '~/components/media/wimetrix-logo.component';
import { scrollStyles } from '~/helpers/style.helpers';
import { useCodeReader } from '~/hooks/code-reader.hook';

export const Example = () => {
	const { status, toggleConnection } = useCodeReader();

	const [counter, setCounter] = useState(0);

	return (
		<>
			<BackgroundImage />

			<ThemeControl sx={{ position: 'absolute', top: '15px', right: '15px' }} />

			<Paper
				sx={{
					height: 'auto',
					width: 0.95,
					maxWidth: 450,
					boxShadow: 3,
					borderRadius: 3,
					margin: 'auto',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'relative',
					padding: 4,
					...scrollStyles.y,
				}}
			>
				<AppLogo sx={{ width: 250 }} />

				<Chip
					sx={{ fontWidth: 'medium', marginBottom: 4 }}
					label={window.ipc.app.env}
				/>

				<Stack sx={{ gap: 1, alignItems: 'center', maxWidth: '100%' }}>
					<Typography
						variant='h3'
						color='primary.main'
					>
						Bar Code Reader
					</Typography>

					<Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center' }}>
						<Chip
							sx={{ fontWeight: 'medium', paddingInline: 2 }}
							color={
								status.type === 'error'
									? 'error'
									: status.type === 'connected'
									? 'success'
									: 'default'
							}
							label={
								status.type === 'connecting'
									? 'Connecting...'
									: status.type === 'disconnecting'
									? 'Disconnecting!'
									: status.type === 'connected'
									? 'Connected!'
									: 'Not Connected!'
							}
						/>
						<CustomButton
							variant='outlined'
							label={status.type === 'connected' ? 'disconnect' : 'connect'}
							size='small'
							isBusy={
								status.type === 'connecting' || status.type === 'disconnecting'
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
					sx={{ marginTop: 4 }}
					label={`Click Me! ${counter}`}
					onClick={() => {
						setCounter(counter + 1);
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
