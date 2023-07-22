import type { ButtonProps, TableCellProps } from '@mui/material';
import type { ReactNode } from 'react';
import type { Sorting } from '~/app/hooks/sorting';
import type { Mui } from '~/app/types/mui';

export const generalTableCommonStyles = [
	'container',
	'controls',
	'tableContainer',
	'table',
	'header',
	'body',
	'row',
	'cell',
	'footer',
] as const;

export type GeneralTableCommonStyle = (typeof generalTableCommonStyles)[number];

export type GeneralTableStyles = Partial<
	Record<GeneralTableCommonStyle, Mui.sxProp>
>;

export type GeneralTableColumn<Type extends Obj> = {
	/** the id of the column */
	id: string;

	/** the styles to apply to the header cell */
	headerSx?: Mui.sxProp;

	/** the styles to apply to the body row cell */
	bodySx?: Mui.sxProp;

	/** the content to show in the header cell */
	headerContent: ReactNode;

	/** the content to show in the body row cell */
	getBodyContent: (row: Type, index: number) => ReactNode;

	/** should the column be shown on the table? */
	hidden?: boolean;

	/** is the column representing a schema field? */
	isSchemaField?: boolean;

	/** can the table be sorted by this column? */
	isSortable?: boolean;

	/** is the column for row action(s)? */
	isAction?: boolean;

	/** is the column for images? */
	isImage?: boolean;

	/** is the column for checkboxes? */
	isCheckbox?: boolean;

	/** is the column for showing row numbers? */
	isRowNumber?: boolean;
};

export type GeneralTableAction<Type extends Obj> = Mui.propsWithSx<{
	/** the id of the action */
	name: string;

	/** the label of the action */
	label?: ReactNode;

	/** the callback function for the the action in table header. header will be rendered as action if this is provided. */
	onHeaderClick?: () => void;

	/** the callback function for the action */
	onClick: (row: Type) => void;

	/** the ico nto show on the action button */
	icon: ReactNode;

	/** the color of the button */
	color?: ButtonProps['color'];

	/** should the action be disabled? */
	disabled?: boolean;

	/** should the action be hidden? */
	hidden?: boolean;
}>;

export type GeneralTableProps<Type extends Obj> = {
	/** the details of the table columns */
	columns: GeneralTableColumn<Type>[];

	/** the actions to show on table rows? */
	rowActions?: GeneralTableAction<Type>[];

	/** the array of data objects */
	data: Type[];

	/** the array of selected row indexes */
	selected?: number[];

	/** the label to show on te table if empty */
	emptyLabel?: string;

	/** the styles to apply to table components */
	styles?: GeneralTableStyles;

	/** the table controls to render on top of the table */
	controls?: JSX.Element | JSX.Element[] | null;

	/** the details for the table's footer */
	footer?: TableCellProps[];

	/** the default sorting for the table */
	defaultSorting?: Sorting<keyof Type>;

	/** should the action button render as full button instead of icons? */
	fullActionButtons?: boolean;

	/** is the page calling the table in loading state? */
	isBusy?: boolean;

	/** should the table have filtering? */
	hasFiltering?: boolean;

	/** should the table have pagination? */
	hasPagination?: boolean;

	/** should the sorting be disabled? */
	disableSorting?: boolean;
};
