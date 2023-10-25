import { Divider, IconButton, Popover, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { FormSchema } from '~/classes/form-schema.class';
import { CustomButton } from '~/components/controls/custom-button.component';
import { SchemaForm } from '~/components/forms/schema-form.component';
import { AppIcon } from '~/components/media/app-icon.component';
import { CustomAvatar } from '~/components/media/custom-avatar.component';
import { resetUserPassword } from '~/endpoints/user.endpoints';
import { getImageUrl } from '~/helpers/image.helpers';
import { logout, useUser } from '~/hooks/user.hook';
import { userResetSchema } from '~/schemas/user.schema';

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
			<Stack
				sx={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 0.5 }}
			>
				<Stack sx={{ maxWidth: 300, textAlign: 'right' }}>
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
			</Stack>

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
						sx={{ flexDirection: 'column' }}
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
