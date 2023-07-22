import { SchemaAdd } from '~/app/components/pages/schema-add';
import { addUser } from '~/app/endpoints/user';
import {
	userFormSchema as schema,
	userTypeDropdownOptions,
} from '~/app/schemas/user';

export const UserAdd = () => {
	return (
		<SchemaAdd
			schema={schema}
			endpoint={addUser}
			lists={{ userType: userTypeDropdownOptions }}
		/>
	);
};
