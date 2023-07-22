import { useLoaderData } from 'react-router-dom';

import { SchemaView } from '~/app/components/pages/schema-view';
import { deleteUser, getUsers } from '~/app/endpoints/user';
import { userViewSchema as schema } from '~/app/schemas/user';

const loader = getUsers;

export const UserView = () => {
	const data = useLoaderData<typeof loader>();
	return (
		<SchemaView
			schema={schema}
			navigation={['add']}
			data={data}
			deleteEndpoint={deleteUser}
			hasUpdate
		/>
	);
};

UserView.loader = loader;
