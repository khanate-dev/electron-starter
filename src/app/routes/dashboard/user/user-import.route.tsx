import { SchemaImportPage } from '../../../components/pages/schema-import-page.component';
import { addUsers } from '../../../endpoints/user.endpoints';
import {
	userFormSchema as schema,
	userTypeDropdownOptions,
} from '../../../schemas/user.schema';

export const UserImport = () => {
	return (
		<SchemaImportPage
			schema={schema}
			endpoint={addUsers}
			selectionLists={{
				UserType: userTypeDropdownOptions,
			}}
		/>
	);
};
