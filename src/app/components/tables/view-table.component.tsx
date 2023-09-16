import {
	Delete as DeleteIcon,
	Edit as UpdateIcon,
	Visibility as ViewIcon,
} from '@mui/icons-material';

import { CustomAvatar } from '~/app/components/media/custom-avatar.component';
import { GeneralTable } from '~/app/components/tables/general-table.component';
import { viewToGeneralTableColumns } from '~/app/helpers/table.helpers';

import type { Dayjs } from 'dayjs';
import type { ReactNode } from 'react';
import type {
	GeneralTableAction,
	GeneralTableProps,
	GeneralTableStyles,
} from '~/app/components/tables/general-table.component';
import type { SortDirection } from '~/app/hooks/sorting.hook';
import type { App } from '~/app/types/app.types';
import type { Mui } from '~/app/types/mui.types';
import type { Utils } from '~/shared/types/utils.types';

export type ViewColumnKey<T extends Obj> = keyof T | (string & {});

export type ViewColumnType =
	| 'string'
	| 'int'
	| 'float'
	| 'date'
	| 'time'
	| 'datetime'
	| 'boolean'
	| ((row: Obj) => ReactNode);

export type ViewColumns<T extends Obj, Cols extends PropertyKey> = {
	[k in Cols]: k extends keyof T
		? T[k] extends string | null
			? 'string'
			: T[k] extends App.dbId | null
			? 'int'
			: T[k] extends number | null
			? 'int' | 'float'
			: T[k] extends Dayjs | null
			? 'date' | 'time' | 'datetime'
			: T[k] extends boolean | null
			? 'boolean'
			: (row: T) => ReactNode
		: (row: T) => ReactNode;
};

export type ViewTableStyles = GeneralTableStyles & {
	actionHeader?: Mui.sxProp;
};

type InheritedProps<T extends Obj> = Pick<
	GeneralTableProps<T>,
	| 'data'
	| 'controls'
	| 'status'
	| 'emptyLabel'
	| 'footer'
	| 'isBusy'
	| 'showRowNumbers'
	| 'hasPagination'
	| 'disableSorting'
>;

export type ViewTableProps<
	T extends Obj,
	Cols extends ViewColumnKey<Utils.noInfer<T>>,
> = InheritedProps<T> & {
	/** the styles to apply to table components */
	styles?: ViewTableStyles;

	/** the schema to use for the table */
	columns: ViewColumns<Utils.noInfer<T>, Cols>;

	/** the function to get the image url for each row. image column will only be shown if this is provided */
	getRowImage?: (row: Utils.noInfer<T>) => string;

	/** actions to show on ViewTable. used for additional actions */
	actions?: Utils.prettify<
		Pick<GeneralTableProps<Utils.noInfer<T>>, 'select'> & {
			/** should the actions be disabled? */
			disabled?: boolean;

			/** should the actions use an icon button for row actions? */
			compact?: boolean;

			/** the callback for the view action. excluded if absent */
			view?: (row: Utils.noInfer<T>) => void;

			/** the callback for the update action. excluded if absent */
			update?: (row: Utils.noInfer<T>) => void;

			/** the callback for the delete action. excluded if absent */
			delete?: (row: Utils.noInfer<T>) => void;

			/** any additional actions to show */
			custom?: GeneralTableAction<Utils.noInfer<T>>[];
		}
	>;

	/** should the table have have searching and filtering? */
	hasFiltering?: boolean;

	/** the default value for sorting */
	defaultSorting?: {
		column: Utils.noInfer<Cols> | (string & {});
		direction: SortDirection;
	};
};

export const ViewTable = <T extends Obj, Cols extends ViewColumnKey<T>>({
	columns: passedColumns,
	getRowImage,
	actions,
	...props
}: ViewTableProps<T, Cols>) => {
	const columns = viewToGeneralTableColumns(passedColumns);

	if (getRowImage) {
		columns.unshift({
			name: 'avatar-image',
			header: 'Image',
			getCell: (row) => <CustomAvatar src={getRowImage(row)} />,
			align: 'center',
			styles: {
				header: { width: 75 },
				cell: { padding: 0, '& > div': { marginInline: 'auto' } },
			},
		});
	}

	const rowActions = actions?.custom ?? [];
	if (actions?.view) {
		rowActions.push({
			name: 'view',
			onClick: (row) => actions.view?.(row),
			icon: <ViewIcon />,
			label: 'View',
			color: 'success',
			disabled: actions.disabled,
		});
	}
	if (actions?.update) {
		rowActions.push({
			name: 'update',
			onClick: (row) => actions.update?.(row),
			icon: <UpdateIcon />,
			label: 'Update',
			color: 'info',
			disabled: actions.disabled,
		});
	}
	if (actions?.delete) {
		rowActions.push({
			name: 'delete',
			onClick: (row) => actions.delete?.(row),
			icon: <DeleteIcon />,
			label: 'Delete',
			color: 'error',
			disabled: actions.disabled,
		});
	}

	return (
		<GeneralTable
			{...props}
			columns={columns}
			rowActions={rowActions}
			compactActions={actions?.compact}
			select={actions?.select}
		/>
	);
};
