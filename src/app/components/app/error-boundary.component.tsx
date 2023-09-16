import {
	ArrowBackIosRounded as BackIcon,
	Replay as ReloadIcon,
} from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import {
	isRouteErrorResponse,
	useNavigate,
	useRouteError,
} from 'react-router-dom';

import { EmptyPage } from '~/app/components/containers/empty-page.component';
import { CustomButton } from '~/app/components/controls/custom-button.component';
import { AppIcon } from '~/app/components/media/app-icon.component';
import { wrappedTextStyle } from '~/app/helpers/style.helpers';
import { logout } from '~/app/hooks/user.hook';
import { AuthError } from '~/shared/errors';

export const ErrorBoundary = () => {
	const navigate = useNavigate();
	const error = useRouteError();

	return (
		<EmptyPage
			backgroundOpacity={0.2}
			boxSx={{
				opacity: 0.7,
				gap: 3,
				maxWidth: '50%',
				'> h1, h3': {
					...wrappedTextStyle,
					maxWidth: '95%',
					lineHeight: 1,
					textAlign: 'center',
				},
				'& > h1': {
					fontSize: '10rem',
					fontWeight: 'bold',
					color: 'error.main',
				},
				'& > h3': {
					...wrappedTextStyle,
					fontSize: '3.5rem',
					fontWeight: 'medium',
					color: 'error.main',
				},
				'& > p': {
					textAlign: 'center',
					fontSize: '1.1rem',
					lineHeight: 1.3,
					maxWidth: '80%',
					maxHeight: 300,
				},
			}}
		>
			{isRouteErrorResponse(error) && (
				<>
					<Typography variant='h1'>{error.status}</Typography>
					<Typography variant='h3'>{error.statusText}</Typography>
					{/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
					{error.data?.message && <Typography>{error.data.message}</Typography>}
				</>
			)}

			{error instanceof Error && (
				<>
					<Typography variant='h3'>{error.name}</Typography>
					<Typography>{error.message}</Typography>
				</>
			)}
			<Stack
				direction='row'
				gap={2}
			>
				{error instanceof AuthError ? (
					<CustomButton
						icon={<AppIcon name='logout' />}
						color='error'
						variant='outlined'
						label='Logout'
						size='small'
						onClick={logout}
					/>
				) : (
					<>
						<CustomButton
							icon={<BackIcon />}
							color='primary'
							label='Go Back'
							variant='outlined'
							size='small'
							onClick={() => {
								navigate(-1);
							}}
						/>
						<CustomButton
							icon={<ReloadIcon />}
							color='error'
							variant='outlined'
							size='small'
							label='Reload'
							onClick={() => {
								navigate(0);
							}}
						/>
					</>
				)}
			</Stack>
		</EmptyPage>
	);
};
