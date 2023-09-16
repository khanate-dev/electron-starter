import { SchemaAdd } from '~/app/components/pages/schema-add.component';
import { addUser } from '~/app/endpoints/user.endpoints';
import {
	userFormSchema as schema,
	userTypeDropdownOptions,
} from '~/app/schemas/user.schema';

export const UserAdd = () => {
	return (
		<SchemaAdd
			schema={schema}
			endpoint={addUser}
			picture='optional'
			selectionLists={{
				UserType: userTypeDropdownOptions,
			}}
		/>
	);
};
