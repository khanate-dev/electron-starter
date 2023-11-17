import { Chip, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { CustomButton } from '~/components/controls/custom-button.component';
import { ThemeControl } from '~/components/controls/theme-control.component';
import { CustomAlert } from '~/components/feedback/custom-alert.component';
import { AppLogo } from '~/components/media/app-logo.component';
import { BackgroundImage } from '~/components/media/background-image.component';
import { WiMetrixLogo } from '~/components/media/wimetrix-logo.component';
import { useSerialPort } from '~/contexts/serial-port.context';
import { scrollStyles } from '~/helpers/style.helpers';

export const Example = () => {
	const { status, connect, disconnect, resume, clearError } = useSerialPort();

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
							label={status.type}
							sx={{
								fontWeight: 'medium',
								paddingInline: 2,
								textTransform: 'capitalize',
							}}
							color={
								status.type === 'paused'
									? 'warning'
									: status.type === 'connected'
									  ? 'success'
									  : 'default'
							}
						/>
						<CustomButton
							variant='outlined'
							size='small'
							label={
								status.type === 'connected'
									? 'disconnect'
									: status.type === 'paused'
									  ? 'resume'
									  : 'connect'
							}
							onClick={
								status.type === 'connected'
									? disconnect
									: status.type === 'paused'
									  ? resume
									  : connect
							}
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
								Read On: {status.reading?.at.format() ?? 'N/A'}
							</Typography>
						</>
					)}

					{Boolean(status.error) && (
						<CustomAlert
							message={status.error}
							severity='error'
							sx={{ maxWidth: '100%' }}
							onClose={clearError}
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
