import { Divider, IconButton, Popover, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { FormSchema } from '~/app/classes/form-schema.class';
import { CustomButton } from '~/app/components/controls/custom-button.component';
import { SchemaForm } from '~/app/components/forms/schema-form.component';
import { AppIcon } from '~/app/components/media/app-icon.component';
import { CustomAvatar } from '~/app/components/media/custom-avatar.component';
import { resetUserPassword } from '~/app/endpoints/user.endpoints';
import { getImageUrl } from '~/app/helpers/image.helpers';
import { logout, useUser } from '~/app/hooks/user.hook';
import { userResetSchema } from '~/app/schemas/user.schema';

const schema = new FormSchema({
	name: 'password-reset',
	zod: userResetSchema,
	fields: {
		oldPassword: { type: 'string', isSecret: true },
		newPassword: { type: 'string', isSecret: true },
		confirmPassword: { type: 'string', isSecret: true },
	},
});

export const UserProfile = () => {
	const user = useUser();

	const [anchor, setAnchor] = useState<null | HTMLElement>(null);

	return (
		<>
			<Stack maxWidth={300}>
				<Typography
					variant='h5'
					noWrap
				>
					{user.UserName}
				</Typography>
				<Typography
					variant='body2'
					noWrap
				>
					{user.UserType}
				</Typography>
			</Stack>

			<IconButton
				aria-describedby='user-popover'
				onClick={(event) => {
					setAnchor(event.currentTarget);
				}}
			>
				<CustomAvatar
					alt={user.UserName}
					src={getImageUrl({
						table: 'user',
						id: user.UserID,
						version: user.ImageVersion,
					})}
					showFallback
				/>
			</IconButton>

			<Popover
				id='user-popover'
				open={Boolean(anchor)}
				anchorEl={anchor}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				onClose={() => {
					setAnchor(null);
				}}
			>
				<Stack sx={{ padding: 2, width: 300 }}>
					<CustomButton
						label='Logout'
						color='error'
						size='large'
						icon={<AppIcon name='logout' />}
						onClick={logout}
					/>

					<Divider sx={{ marginBlock: 3 }}>Reset Password</Divider>

					<SchemaForm
						schema={schema}
						submitLabel='Reset Password'
						isUpdate={false}
						sx={{
							flexDirection: 'column',
							'& > *': {
								marginTop: 0,
							},
						}}
						onSubmit={async (data) => {
							await resetUserPassword(user.UserID, data);
							setTimeout(() => {
								setAnchor(null);
							}, 500);
							return 'password reset successful!';
						}}
					/>
				</Stack>
			</Popover>
		</>
	);
};
