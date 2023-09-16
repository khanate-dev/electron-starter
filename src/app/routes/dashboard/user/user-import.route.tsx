import { SchemaImportPage } from '~/app/components/pages/schema-import-page.component';
import { addUsers } from '~/app/endpoints/user.endpoints';
import {
	userFormSchema as schema,
	userTypeDropdownOptions,
} from '~/app/schemas/user.schema';

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
