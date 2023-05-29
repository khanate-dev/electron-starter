import { useNavigate, useParams } from 'react-router-dom';

import { getParamId } from '~/shared/helpers/route';
import { PageContainer } from '~/app/components/containers/page-container';
import { SchemaForm } from '~/app/components/forms/schema-form';

import type { UpdateSchemaFormProps } from '~/app/components/forms/schema-form';
import type {
	BaseSelectionType,
	FormFieldZodType,
	FormSchemaField,
} from '~/app/schemas';
import type { z } from 'zod';

export type SchemaUpdateProps<
	Zod extends z.ZodObject<Record<string, FormFieldZodType>, 'strict'>,
	Keys extends keyof Zod['shape'],
	WorkingObj extends {
		[K in Keys]: Zod['shape'][K] extends
			| BaseSelectionType
			| z.ZodNullable<BaseSelectionType>
			? z.infer<Zod['shape'][K]> | null
			: Zod['shape'][K] extends z.ZodNumber | z.ZodNullable<z.ZodNumber>
			? string
			: z.infer<Zod['shape'][K]>;
	},
	Fields extends {
		[K in Keys]: FormSchemaField<Zod['shape'][K], WorkingObj>;
	}
> = {
	/** the endpoint functions to use */
	endpoint: (id: App.DbId, body: FormData) => Promise<void>;
} & Pick<
	UpdateSchemaFormProps<Zod, Keys, WorkingObj, Fields>,
	| 'schema'
	| 'sx'
	| 'formId'
	| 'lists'
	| 'defaultValues'
	| 'actions'
	| 'picture'
	| 'isBusy'
	| 'disabled'
>;

export const SchemaUpdate = <
	Zod extends z.ZodObject<Record<string, FormFieldZodType>, 'strict'>,
	Keys extends keyof Zod['shape'],
	WorkingObj extends {
		[K in Keys]: Zod['shape'][K] extends
			| BaseSelectionType
			| z.ZodNullable<BaseSelectionType>
			? z.infer<Zod['shape'][K]> | null
			: Zod['shape'][K] extends z.ZodNumber | z.ZodNullable<z.ZodNumber>
			? string
			: z.infer<Zod['shape'][K]>;
	},
	Fields extends {
		[K in Keys]: FormSchemaField<Zod['shape'][K], WorkingObj>;
	}
>(
	props: SchemaUpdateProps<Zod, Keys, WorkingObj, Fields>
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
				onCancel={() => navigate(-1)}
				onSubmit={async (data) => {
					await props.endpoint(getParamId(params), data);
					return navigate(-1);
				}}
			/>
		</PageContainer>
	);
};
