import { SchemaAdd } from '../../../components/pages/schema-add.component';
import { addUser } from '../../../endpoints/user.endpoints';
import {
	userFormSchema as schema,
	userTypeDropdownOptions,
} from '../../../schemas/user.schema';

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
