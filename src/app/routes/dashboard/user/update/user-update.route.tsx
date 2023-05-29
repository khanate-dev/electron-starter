import { useLoaderData } from 'react-router-dom';

import { getUserById, updateUser } from '~/app/endpoints/user';
import { SchemaUpdate } from '~/app/components/pages/schema-update';
import { getParamId } from '~/shared/helpers/route';
import {
	userFormSchema as schema,
	userTypeDropdownOptions,
} from '~/app/schemas/user';

const loader = (async ({ params }) => {
	return getUserById(getParamId(params));
}) satisfies Router.Loader;

export const UserUpdate = () => {
	const user = useLoaderData<typeof loader>();
	return (
		<SchemaUpdate
			schema={schema}
			endpoint={updateUser}
			lists={{ userType: userTypeDropdownOptions }}
			defaultValues={{ ...user, password: '', confirmPassword: '' }}
		/>
	);
};

UserUpdate.loader = loader;
