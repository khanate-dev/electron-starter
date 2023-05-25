import {
	userFormSchema as schema,
	userTypeDropdownOptions,
} from '~/app/schemas/user';
import { addUser } from '~/app/endpoints/user';
import { SchemaAdd } from '~/app/components/pages/schema-add';

export const UserAdd = () => {
	return (
		<SchemaAdd
			schema={schema}
			endpoint={addUser}
			lists={{ userType: userTypeDropdownOptions }}
		/>
	);
};
