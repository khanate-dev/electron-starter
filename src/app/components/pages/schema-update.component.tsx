import { useNavigate, useParams } from 'react-router-dom';

import { PageContainer } from '../containers/page-container.component';
import { SchemaForm } from '../forms/schema-form.component';
import { getParamId } from '../../helpers/route.helpers';

import type { FormSchema } from '../../classes/form-schema.class';
import type {
	SchemaFormSubmitData,
	UpdateSchemaFormProps,
} from '../forms/schema-form.component';
import type { App } from '../../types/app.types';

export type SchemaUpdateProps<
	T extends FormSchema,
	Picture extends 'required' | 'optional',
> = Pick<
	UpdateSchemaFormProps<T, Picture>,
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
	endpoint: (
		id: App.dbId,
		data: SchemaFormSubmitData<T, Picture>,
	) => Promise<unknown>;
};

export const SchemaUpdate = <
	T extends FormSchema,
	Picture extends 'required' | 'optional',
>(
	props: SchemaUpdateProps<T, Picture>,
) => {
	const params = useParams();
	const navigate = useNavigate();

	return (
		<PageContainer
			title={`Update ${props.schema.label}`}
			navigation={['back']}
		>
			<SchemaForm
				{...props}
				isUpdate
				onCancel={() => {
					navigate(-1);
				}}
				onSubmit={async (data) => {
					await props.endpoint(getParamId(params), data as never);
					navigate(-1);
				}}
			/>
		</PageContainer>
	);
};
