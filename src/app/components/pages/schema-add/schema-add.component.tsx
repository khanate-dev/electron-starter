import { useNavigate } from 'react-router-dom';

import { PageContainer } from '~/app/components/containers/page-container';
import { SchemaForm } from '~/app/components/forms/schema-form';

import type { AddSchemaFormProps } from '~/app/components/forms/schema-form';
import type {
	BaseSelectionType,
	FormFieldZodType,
	FormSchemaField,
} from '~/app/schemas';
import type { z } from 'zod';

export type SchemaAddProps<
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
	endpoint: (body: FormData) => Promise<void>;
} & Pick<
	AddSchemaFormProps<Zod, Keys, WorkingObj, Fields>,
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

export const SchemaAdd = <
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
	props: SchemaAddProps<Zod, Keys, WorkingObj, Fields>
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
				onCancel={() => navigate(-1)}
				onSubmit={async (data) => {
					await props.endpoint(data);
					return navigate(-1);
				}}
			/>
		</PageContainer>
	);
};
