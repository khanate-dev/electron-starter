import { useState } from 'react';
import { useNavigate, useNavigation, useRevalidator } from 'react-router-dom';

import { PageContainer } from '~/app/components/containers/page-container';
import { ViewTable } from '~/app/components/tables/view-table';
import { DeleteDialog } from '~/app/components/dialogs/delete-dialog';

import type { PageContainerProps } from '~/app/components/containers/page-container';
import type { AnyZodObject, z } from 'zod';
import type { ViewSchema, ViewSchemaField } from '~/app/schemas';

export type SchemaViewProps<
	Zod extends AnyZodObject,
	Fields extends {
		[K in keyof Zod['shape']]?: ViewSchemaField<Zod['shape'][K]>;
	},
	PK extends keyof Zod['shape'],
	ID extends keyof Zod['shape'],
	Row extends z.infer<Zod>
> = Pick<PageContainerProps, 'controls' | 'navigation'> & {
	/** the schema for the current page */
	schema: ViewSchema<Zod, Fields, PK, ID>;

	/** the title of the page */
	title?: string;

	/** the list of data. If provided, will override any data given by the loader */
	data: Row[];

	/** the function to call to reload the data. used to refetch after deletion. overrides default revalidation */
	onReload?: () => void;

	/** the endpoint for the delete row operation. delete operation is only rendered if provided. */
	deleteEndpoint?: (id: App.DbId) => Promise<void>;

	/** does the page have an update route? */
	hasUpdate?: boolean;

	/** does the page have a details routes? */
	hasDetails?: boolean;

	/** should the view disallow data export? */
	noExport?: boolean;

	/** should the view hide search and filters? */
	noFiltering?: boolean;

	/** is the parent page busy? */
	isBusy?: boolean;
};

type ToDelete = {
	id: App.DbId;
	label: string;
};

export const SchemaView = <
	Zod extends AnyZodObject,
	Fields extends {
		[K in keyof Zod['shape']]?: ViewSchemaField<Zod['shape'][K]>;
	},
	PK extends keyof Zod['shape'],
	ID extends keyof Zod['shape'],
	Row extends z.infer<Zod>
>({
	schema,
	title,
	navigation: passedNavigation,
	controls,
	data,
	onReload,
	deleteEndpoint,
	hasUpdate,
	hasDetails,
	noExport,
	noFiltering,
	isBusy: isParentBusy,
}: SchemaViewProps<Zod, Fields, PK, ID, Row>) => {
	const navigate = useNavigate();
	const navigation = useNavigation();
	const revalidator = useRevalidator();

	const [toDelete, setToDelete] = useState<null | ToDelete>(null);

	const isBusy =
		isParentBusy || navigation.state !== 'idle' || revalidator.state !== 'idle';

	return (
		<PageContainer
			title={title ?? `View ${schema.label}`}
			navigation={passedNavigation}
			controls={controls}
		>
			<ViewTable
				schema={schema}
				data={data}
				isBusy={isBusy}
				hasFiltering={!noFiltering}
				hasExport={!noExport}
				actions={{
					view: hasDetails
						? (state) =>
								navigate(`details/${state[schema.primaryKey] as App.DbId}`)
						: undefined,
					update: hasUpdate
						? (state) =>
								navigate(`update/${state[schema.primaryKey] as App.DbId}`)
						: undefined,
					delete: deleteEndpoint
						? (state) =>
								setToDelete({
									id: state[schema.primaryKey] as App.DbId,
									label: state[schema.identifier] as string,
								})
						: undefined,
				}}
				hasPagination
			/>

			{deleteEndpoint && toDelete && (
				<DeleteDialog
					target={schema.label}
					id={toDelete.id}
					label={toDelete.label}
					onCancel={() => setToDelete(null)}
					onDelete={async () => {
						await deleteEndpoint(toDelete.id);
						onReload?.() ?? revalidator.revalidate();
						setTimeout(() => setToDelete(null), 1500);
					}}
				/>
			)}
		</PageContainer>
	);
};
