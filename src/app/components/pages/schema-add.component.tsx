import { useNavigate } from 'react-router-dom';

import { PageContainer } from '~/app/components/containers/page-container.component';
import { SchemaForm } from '~/app/components/forms/schema-form.component';

import type { FormSchema } from '~/app/classes/form-schema.class';
import type {
	AddSchemaFormProps,
	SchemaFormSubmitData,
} from '~/app/components/forms/schema-form.component';

export type SchemaAddProps<
	T extends FormSchema,
	Picture extends 'required' | 'optional',
> = Pick<
	AddSchemaFormProps<T, Picture>,
	| 'schema'
	| 'sx'
	| 'formId'
	| 'selectionLists'
	| 'suggestionLists'
	| 'defaultValues'
	| 'picture'
	| 'isBusy'
	| 'disabled'
> & {
	/** the endpoint functions to use */
	endpoint: (data: SchemaFormSubmitData<T, Picture>) => Promise<unknown>;
};

export const SchemaAdd = <
	T extends FormSchema,
	Picture extends 'required' | 'optional',
>(
	props: SchemaAddProps<T, Picture>,
) => {
	const navigate = useNavigate();

	return (
		<PageContainer
			title={`Add ${props.schema.label}`}
			navigation={['back']}
		>
			<SchemaForm
				{...props}
				isUpdate={false}
				onCancel={() => {
					navigate(-1);
				}}
				onSubmit={async (data) => {
					await props.endpoint(data as never);
					navigate(-1);
				}}
			/>
		</PageContainer>
	);
};
