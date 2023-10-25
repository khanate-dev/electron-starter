import { SchemaImport } from '~/components/app/schema-import.component';
import { PageContainer } from '~/components/containers/page-container.component';
import { useStatus } from '~/hooks/status.hook';

import type { FormSchema } from '~/classes/form-schema.class';
import type { SchemaImportProps } from '~/components/app/schema-import.component';
import type { BulkResponse } from '~/helpers/api.helpers';

export type SchemaImportPageProps<T extends FormSchema> = Pick<
	SchemaImportProps<T>,
	'schema' | 'selectionLists'
> & {
	/** the endpoint functions to use */
	endpoint: (
		data: T['zod']['_output'][],
	) => Promise<BulkResponse<T['zod']['_output']>>;
};

export const SchemaImportPage = <T extends FormSchema>({
	schema,
	selectionLists,
	endpoint,
}: SchemaImportPageProps<T>) => {
	const status = useStatus();
	return (
		<PageContainer
			title={`Import ${schema.label}`}
			navigation={['back']}
		>
			<SchemaImport
				schema={schema}
				selectionLists={selectionLists as never}
				status={status}
				onImport={endpoint}
			/>
		</PageContainer>
	);
};
