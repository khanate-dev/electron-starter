import { useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router-dom';
import { Typography, Paper } from '@mui/material';

import {
	userViewSchema,
	userFormSchema,
	userTypeDropdownOptions,
} from '~/app/schemas/user';
import { addUser, getUsers } from '~/app/endpoints/user';
import { WiMetrixLogo } from '~/app/components/media/wimetrix-logo';
import { DetailTableDialog } from '~/app/components/dialogs/detail-table-dialog';
import { BackgroundImage } from '~/app/components/media/background-image';
import { CustomButton } from '~/app/components/controls/custom-button';
import { SchemaForm } from '~/app/components/forms/schema-form';

const loader = getUsers;

export const Register = () => {
	const users = useLoaderData<typeof loader>();
	const revalidator = useRevalidator();

	const [isShowingUsers, setIsShowingUsers] = useState(false);

	return (
		<>
			<BackgroundImage />

			<CustomButton
				color='warning'
				label={!users.length ? 'No Users Found!' : 'View Users'}
				disabled={!users.length}
				isBusy={revalidator.state === 'loading'}
				sx={{
					position: 'absolute',
					left: 20,
					top: 20,
					zIndex: 15,
					fontSize: '1.2em',
				}}
				onClick={() => setIsShowingUsers(true)}
			/>

			{isShowingUsers && (
				<DetailTableDialog
					title='User List'
					schema={userViewSchema}
					data={users}
					onClose={() => setIsShowingUsers(!isShowingUsers)}
				/>
			)}

			<Paper
				className='scroll-y'
				sx={{
					width: 0.95,
					height: 'auto',
					maxWidth: 600,
					boxShadow: 3,
					borderRadius: 3,
					margin: 'auto 10% auto auto',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					flexWrap: 'nowrap',
					alignItems: 'center',
					position: 'relative',
					overflow: 'hidden',
					padding: 4,
					gap: 4,
				}}
			>
				<Typography
					variant='h1'
					color='primary'
				>
					Create User
				</Typography>

				<SchemaForm
					schema={userFormSchema}
					isBusy={revalidator.state === 'loading'}
					isUpdate={false}
					sx={{
						'& > :not(:first-of-type, .MuiAlert-root.showing)': {
							marginTop: 4,
						},
						'& > .MuiGrid-root:nth-child(2)': {
							gap: 3,
						},
						'& > .MuiGrid-root > .MuiButton-root': {
							width: 1,
							height: 50,
							marginTop: 1,
						},
					}}
					lists={{
						userType: userTypeDropdownOptions,
					}}
					onSubmit={async (data) => {
						await addUser(data);
						revalidator.revalidate();
						return 'user creation successful!';
					}}
				/>

				<WiMetrixLogo
					sx={{ width: 150 }}
					showPoweredBy
				/>
			</Paper>
		</>
	);
};

Register.loader = loader;
