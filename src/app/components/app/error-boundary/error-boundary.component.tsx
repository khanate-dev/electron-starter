import {
	isRouteErrorResponse,
	useNavigate,
	useRouteError,
} from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import {
	ArrowBackIosRounded as BackIcon,
	Replay as ReloadIcon,
} from '@mui/icons-material';

import { EmptyPage } from '~/app/components/containers/empty-page';
import { CustomButton } from '~/app/components/controls/custom-button';
import { AuthError } from '~/shared/errors';
import { logout } from '~/app/contexts/user';
import { LogoutIcon } from '~/app/components/media/icons';

export const ErrorBoundary = () => {
	const navigate = useNavigate();
	const error = useRouteError();

	return (
		<EmptyPage
			backgroundOpacity={0.2}
			boxSx={{
				opacity: 0.7,
				gap: 2,
				maxWidth: '70%',
				'> h1, h3': {
					color: 'primary.light',
					maxWidth: '100%',
					overflow: 'hidden',
					whiteSpace: 'nowrap',
					lineHeight: 1,
				},
				'& > h1': {
					fontSize: '10rem',
					fontWeight: 'bold',
					color: 'error.main',
				},
				'& > h3': {
					paddingBottom: '5px',
					fontSize: '3.5rem',
					fontWeight: 'medium',
				},
				'& > code': {
					fontSize: '1.5em',
					fontWeight: 'medium',
					color: 'error.main',
					maxWidth: '95%',
					maxHeight: 150,
					opacity: 0.8,
					padding: 1,
					borderRadius: 1,
					textAlign: 'center',
					overflow: 'hidden',
				},
			}}
		>
			{isRouteErrorResponse(error) && (
				<>
					<Typography variant='h1'>{error.status}</Typography>

					<Typography variant='h3'>{error.statusText}</Typography>
					{/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
					{error.data?.message && <code>{error.data.message}</code>}
				</>
			)}

			{error instanceof Error && (
				<>
					<Typography variant='h3'>{error.name}</Typography>
					<code>{error.message}</code>
				</>
			)}
			<Stack
				direction='row'
				gap={1}
			>
				{error instanceof AuthError ? (
					<CustomButton
						icon={<LogoutIcon />}
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
							onClick={() => navigate(-1)}
						/>
						<CustomButton
							icon={<ReloadIcon />}
							color='primary'
							variant='outlined'
							size='small'
							label='Reload'
							onClick={() => navigate(0)}
						/>
					</>
				)}
			</Stack>
		</EmptyPage>
	);
};
