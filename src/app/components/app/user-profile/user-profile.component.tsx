import { useState } from 'react';
import { Divider, Popover, Typography, IconButton, Stack } from '@mui/material';
import { z } from 'zod';

import { resetUserPassword } from '~/app/endpoints/user';
import { FormSchema } from '~/app/schemas';
import { userZodSchema } from '~/app/schemas/user';
import { logout, useUser } from '~/app/contexts/user';
import { getImageUrl } from '~/app/helpers/image';
import { CustomAvatar } from '~/app/components/media/custom-avatar';
import { SchemaForm } from '~/app/components/forms/schema-form';
import { CustomButton } from '~/app/components/controls/custom-button';
import { AppIcon } from '~/app/components/media/app-icon';

const resetSchema = new FormSchema({
	name: 'password-reset',
	zod: z.strictObject({
		oldPassword: userZodSchema.shape.password,
		newPassword: userZodSchema.shape.password,
		confirmPassword: userZodSchema.shape.password,
	}),
	fields: {
		oldPassword: { type: 'string', isSecret: true },
		newPassword: { type: 'string', isSecret: true },
		confirmPassword: { type: 'string', isSecret: true },
	},
});

export const UserProfile = () => {
	const user = useUser();

	const [anchor, setAnchor] = useState<null | HTMLButtonElement>(null);

	return (
		<>
			<Stack
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'flex-end',
					width: 'auto',
					maxWidth: 300,
					'> *': {
						width: '100%',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					},
				}}
			>
				<Typography
					color='primary'
					variant='h5'
				>
					{user.userName}
				</Typography>
				<Typography
					color='secondary'
					variant='subtitle2'
				>
					{user.userType}
				</Typography>
			</Stack>

			<IconButton
				aria-describedby='user-popover'
				onClick={(event) => setAnchor(event.currentTarget)}
			>
				<CustomAvatar
					src={getImageUrl('user', user.userName, user.imageUpdatedAt)}
					alt={user.userName}
					showFallback
				/>
			</IconButton>

			<Popover
				id='user-popover'
				open={Boolean(anchor)}
				anchorEl={anchor}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				onClose={() => setAnchor(null)}
			>
				<Stack
					sx={{
						display: 'flex',
						flexDirection: 'column',
						padding: 3,
						width: 300,
						alignItems: 'stretch',
						overflow: 'hidden',
						'& > .MuiDivider-root': {
							marginBlock: 3,
						},
					}}
				>
					<CustomButton
						label='Logout'
						color='error'
						size='large'
						icon={<AppIcon name='logout' />}
						onClick={logout}
					/>

					<Divider />

					<SchemaForm
						schema={resetSchema}
						submitLabel='Reset Password'
						isUpdate={false}
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'stretch',
							width: '100%',
							'& > *': {
								marginTop: 2,
							},
							'& > .MuiGrid-root:first-of-type': {
								marginTop: 0,
							},
						}}
						onSubmit={async (data) => {
							await resetUserPassword(user.userID, data);
							setTimeout(() => setAnchor(null), 500);
							return 'password reset successful!';
						}}
					/>
				</Stack>
			</Popover>
		</>
	);
};
