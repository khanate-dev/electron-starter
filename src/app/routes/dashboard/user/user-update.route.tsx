import { useLoaderData } from 'react-router-dom';

import { FormSchema } from '../../../classes/form-schema.class';
import { SchemaUpdate } from '../../../components/pages/schema-update.component';
import { getUserById, updateUser } from '../../../endpoints/user.endpoints';
import { getParamId } from '../../../helpers/route.helpers';
import {
	userFormSchema,
	userFormZod,
	userTypeDropdownOptions,
} from '../../../schemas/user.schema';

import type { LoaderFunction } from 'react-router-dom';

const schema = new FormSchema({
	name: 'user',
	zod: userFormZod.extend({ Password: userFormZod.shape.Password.nullable() }),
	fields: {
		...userFormSchema.fields,
		Password: { type: 'string', isSecret: true, notRequired: true },
	},
});

const loader = (async ({ params }) => {
	return getUserById(getParamId(params));
}) satisfies LoaderFunction;

export const UserUpdate = () => {
	const user = useLoaderData<typeof loader>();
	return (
		<SchemaUpdate
			schema={schema}
			endpoint={updateUser}
			defaultValues={{ ...user, Password: '' }}
			selectionLists={{
				UserType: userTypeDropdownOptions,
			}}
			picture={{
				id: user.UserID,
				version: user.ImageVersion,
				required: 'optional',
			}}
		/>
	);
};

UserUpdate.loader = loader;
