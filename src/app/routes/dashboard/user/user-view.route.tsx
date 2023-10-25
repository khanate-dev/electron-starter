import { useLoaderData } from 'react-router-dom';

import { SchemaView } from '../../../components/pages/schema-view.component';
import { getUsers } from '../../../endpoints/user.endpoints';

const loader = getUsers;

export const UserView = () => {
	const data = useLoaderData<typeof loader>();
	return (
		<SchemaView
			data={data}
			title='User'
			id='UserID'
			navigation={['add', 'import']}
			rowActions={{ update: true }}
			columns={{
				UserName: 'string',
				UserType: 'string',
			}}
			hasImage
		/>
	);
};

UserView.loader = loader;
