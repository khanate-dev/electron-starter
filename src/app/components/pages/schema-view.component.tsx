import { useState } from 'react';
import { useNavigate, useNavigation, useRevalidator } from 'react-router-dom';

import { DataExport } from '~/app/components/app/data-export.component';
import { PageContainer } from '~/app/components/containers/page-container.component';
import { ConfirmationDialog } from '~/app/components/dialogs/confirmation-dialog.component';
import { ViewTable } from '~/app/components/tables/view-table.component';
import { getImageUrl } from '~/app/helpers/image.helpers';
import { useUser } from '~/app/hooks/user.hook';

import type { PageContainerProps } from '~/app/components/containers/page-container.component';
import type {
	ViewColumnKey,
	ViewTableProps,
} from '~/app/components/tables/view-table.component';
import type { App } from '~/app/types/app.types';
import type { Utils } from '~/shared/types/utils.types';

export type SchemaViewProps<
	T extends Obj,
	Cols extends ViewColumnKey<T>,
> = Pick<PageContainerProps, 'controls' | 'status' | 'navigation'> &
	Pick<
		ViewTableProps<T, Cols>,
		'columns' | 'styles' | 'data' | 'defaultSorting' | 'isBusy'
	> & {
		/** the title of the page */
		title: string;

		/** the primaryKey column for the table */
		id: Utils.keysOfType<Utils.noInfer<T>, App.dbId> & keyof Utils.noInfer<T>;

		/** the row actions to enable in the view */
		rowActions?: {
			/** the details for the row delete action. Deletion is not available if excluded */
			delete?: {
				/** the endpoint for the delete row operation */
				endpoint: (id: App.dbId) => Promise<unknown>;

				/** overrides default loader revalidation */
				revalidate?: () => void;
			};

			/** does the page have an update route? */
			update?: boolean;

			/** does the page have a details routes? */
			details?: boolean;
		};

		/** should the view disallow data export? */
		noExport?: boolean;

		/** should the view hide search and filters? */
		noFiltering?: boolean;
	} & ([Extract<T, { ImageVersion: number | null }>] extends [never]
		? { hasImage?: never }
		: { hasImage: true });

export const SchemaView = <T extends Obj, Cols extends ViewColumnKey<T>>({
	data,
	columns,
	styles,
	id,
	title,
	navigation: passedNavigation,
	status,
	controls,
	rowActions,
	defaultSorting,
	hasImage,
	noExport,
	noFiltering,
	isBusy: isParentBusy,
}: SchemaViewProps<T, Cols>) => {
	const navigate = useNavigate();
	const navigation = useNavigation();
	const revalidator = useRevalidator();

	const { UserType } = useUser();

	const [deleteId, setDeleteId] = useState<null | App.dbId>(null);

	const isBusy =
		isParentBusy || navigation.state !== 'idle' || revalidator.state !== 'idle';

	const deletion = rowActions?.delete;

	const getId = (row: T) => row[id] as App.dbId;

	return (
		<PageContainer
			title={`View ${title}`}
			navigation={passedNavigation}
			status={status}
			controls={controls}
		>
			<ViewTable
				columns={columns}
				styles={styles}
				data={data}
				isBusy={isBusy}
				hasFiltering={!noFiltering}
				defaultSorting={defaultSorting}
				getRowImage={
					hasImage
						? (row) =>
								getImageUrl({
									table: title,
									id: getId(row),
									version: row.ImageVersion as number,
								})
						: undefined
				}
				controls={
					!noExport
						? [
								(totalData, visibleData) => (
									<DataExport
										key='view-page-data-export'
										totalData={totalData}
										visibleData={visibleData}
										columns={columns}
										fileName={title}
									/>
								),
						  ]
						: undefined
				}
				actions={{
					view: rowActions?.details
						? (row) => {
								navigate(`details/${getId(row)}`);
						  }
						: undefined,
					update:
						UserType !== 'Worker' && rowActions?.update
							? (row) => {
									navigate(`update/${getId(row)}`);
							  }
							: undefined,
					delete:
						UserType === 'Administrator' && rowActions?.delete
							? (row) => {
									setDeleteId(getId(row));
							  }
							: undefined,
				}}
				hasPagination
			/>

			{deletion && deleteId && (
				<ConfirmationDialog
					label={`You are deleting an entry from ${title}`}
					confirmAction={async () => {
						return deletion.endpoint(deleteId);
					}}
					onClose={(success) => {
						setDeleteId(null);
						if (success) deletion.revalidate?.() ?? revalidator.revalidate();
					}}
				/>
			)}
		</PageContainer>
	);
};
