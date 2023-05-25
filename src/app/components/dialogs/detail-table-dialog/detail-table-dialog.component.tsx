import { ViewTable } from '~/app/components/tables/view-table';
import { GeneralDialog } from '~/app/components/dialogs/general-dialog';

import type { GeneralDialogProps } from '~/app/components/dialogs/general-dialog';
import type { ViewTableProps } from '~/app/components/tables/view-table';
import type { AnyZodObject } from 'zod';
import type { ViewSchemaField } from '~/app/schemas';

export type DetailTableDialogProps<
	Zod extends AnyZodObject,
	Fields extends {
		[K in keyof Zod['shape']]?: ViewSchemaField<Zod['shape'][K]>;
	},
	PK extends keyof Zod['shape'],
	ID extends keyof Zod['shape']
> = {
	/** should the table columns be fixed width or auto? */
	isTableAutoLayout?: boolean;
} & Pick<
	GeneralDialogProps,
	| 'onClose'
	| 'title'
	| 'actions'
	| 'hasCloseAction'
	| 'maxWidth'
	| 'disableActions'
> &
	Pick<ViewTableProps<Zod, Fields, PK, ID>, 'schema' | 'data'>;

export const DetailTableDialog = <
	Zod extends AnyZodObject,
	Fields extends {
		[K in keyof Zod['shape']]?: ViewSchemaField<Zod['shape'][K]>;
	},
	PK extends keyof Zod['shape'],
	ID extends keyof Zod['shape']
>({
	schema,
	data,
	isTableAutoLayout,
	...dialogProps
}: DetailTableDialogProps<Zod, Fields, PK, ID>) => {
	return (
		<GeneralDialog
			{...dialogProps}
			sx={{ height: '90vh' }}
			maxWidth={dialogProps.maxWidth ?? 'lg'}
		>
			<ViewTable
				schema={schema}
				data={data}
				styles={{
					container: {
						width: '100%',
					},
					table: {
						tableLayout: isTableAutoLayout ? 'auto' : 'fixed',
					},
				}}
				hasPagination
			/>
		</GeneralDialog>
	);
};
