import type { FieldAction } from '~/app/components/app/field-actions';
import type {
	GeneralTableAction,
	GeneralTableProps,
	GeneralTableStyles,
} from '~/app/components/tables/general-table';
import type { ViewSchema, ViewSchemaField } from '~/app/schemas';
import type { AnyZodObject, z } from 'zod';

export type ViewTableStyles = {
	actionHeader?: Mui.SxProp;
} & GeneralTableStyles;

type InheritedProps<Type extends Obj> = Pick<
	GeneralTableProps<Type>,
	| 'data'
	| 'defaultSorting'
	| 'controls'
	| 'emptyLabel'
	| 'footer'
	| 'isBusy'
	| 'hasPagination'
	| 'disableSorting'
>;

export type ViewTableProps<
	Zod extends AnyZodObject,
	Fields extends {
		[K in keyof Zod['shape']]?: ViewSchemaField<Zod['shape'][K]>;
	},
	PK extends keyof Zod['shape'],
	ID extends keyof Zod['shape']
> = {
	/** the schema to use for the table */
	schema: ViewSchema<Zod, Fields, PK, ID>;

	/** the styles to apply to table components. @default {} */
	styles?: ViewTableStyles;

	/** actions to show on ViewTable. used for additional actions */
	actions?: {
		/** should the actions be disabled? */
		disabled?: boolean;

		/** should the actions use a full button instead of icon buttons? */
		fullButtons?: boolean;

		/** the details for row selections */
		select?: {
			/** the currently selected rows */
			selected: number[];

			/** the function to call when selected rows change. returns selected index and changes */
			onSelection: (selected: number[]) => void;
		};

		/** the callback for the view action. excluded if absent */
		view?: (row: z.infer<Zod>) => void;

		/** the callback for the update action. excluded if absent */
		update?: (row: z.infer<Zod>) => void;

		/** the callback for the delete action. excluded if absent */
		delete?: (row: z.infer<Zod>) => void;

		/** any additional actions to show */
		custom?: GeneralTableAction<z.infer<Zod>>[];

		/** actions to show against schema fields */
		field?: { [K in keyof Fields]?: FieldAction[] };
	};

	/** should the table have have searching and filtering? */
	hasFiltering?: boolean;

	/** should the table allow exporting the data? */
	hasExport?: boolean;
} & InheritedProps<z.infer<Zod>>;
