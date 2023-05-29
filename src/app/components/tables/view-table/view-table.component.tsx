import { Checkbox, Stack } from '@mui/material';
import {
	Visibility as ViewIcon,
	Edit as UpdateIcon,
	Delete as DeleteIcon,
} from '@mui/icons-material';
import { isDayjs } from 'dayjs';

import { useUser } from '~/app/contexts/user';
import { dayjsFormatPatterns } from '~/shared/helpers/date';
import { getImageUrl } from '~/app/helpers/image';
import { CustomAvatar } from '~/app/components/media/custom-avatar';
import { GeneralTable } from '~/app/components/tables/general-table';
import { FieldActions } from '~/app/components/app/field-actions';

import type {
	GeneralTableColumn,
	GeneralTableAction,
} from '~/app/components/tables/general-table';
import type { ViewTableProps } from './view-table.types';
import type { AnyZodObject, z } from 'zod';
import type { ViewSchema, ViewSchemaField } from '~/app/schemas';

export const ViewTable = <
	Zod extends AnyZodObject,
	Fields extends {
		[K in keyof Zod['shape']]?: ViewSchemaField<Zod['shape'][K]>;
	},
	PK extends keyof Zod['shape'],
	ID extends keyof Zod['shape'],
	Schema extends ViewSchema<Zod, Fields, PK, ID> = ViewSchema<
		Zod,
		Fields,
		PK,
		ID
	>
>({
	schema,
	data,
	styles: passedStyles,
	controls,
	actions,
	emptyLabel,
	footer,
	defaultSorting,
	isBusy,
	hasPagination,
	disableSorting,
	hasFiltering,
	hasExport,
}: ViewTableProps<Zod, Fields, PK, ID>) => {
	const { userType } = useUser();

	const handleSelectionChange = (index?: number) => {
		if (index === -1 || !actions?.select) return;

		let newSelected: number[] = [];
		const { selected, onSelection } = actions.select;
		if (index !== undefined) {
			newSelected = selected.includes(index)
				? selected.filter((row) => row !== index)
				: [...selected, index];
		} else {
			newSelected =
				selected.length === data.length ? [] : data.map((_, idx) => idx);
		}

		onSelection(newSelected);
	};

	const getSchemaFieldBodyContent = (
		field: Schema['fieldsArray'][number],
		row: z.infer<Zod>
	): JSX.Element => {
		let content: React.Node = '';
		const value: unknown = row[field.name] ?? '';

		switch (field.type) {
			case 'boolean': {
				content = value ? 'Yes' : 'No';
				break;
			}
			case 'date':
			case 'time':
			case 'datetime': {
				content = isDayjs(value)
					? value.format(dayjsFormatPatterns[field.type])
					: '';
				break;
			}
			case 'int':
			case 'float': {
				content =
					typeof value === 'number'
						? value.toFixed(field.type === 'int' ? 0 : 3)
						: '';
				break;
			}
			case 'string': {
				content = typeof value === 'string' ? value : '';
				break;
			}
		}

		const fieldActions = actions?.field?.[field.name];

		if (!fieldActions) return <>{content}</>;

		return (
			<Stack direction='row'>
				<span>{content}</span>
				<FieldActions
					actions={fieldActions}
					disabled={actions.disabled}
					fullButtons={actions.fullButtons}
				/>
			</Stack>
		);
	};

	const columns: GeneralTableColumn<z.infer<Zod>>[] = [
		{
			id: 'selection-checkbox',
			headerContent: (
				<Checkbox
					color='default'
					checked={actions?.select?.selected.length === data.length}
					indeterminate={
						Boolean(actions?.select?.selected.length) &&
						actions?.select?.selected.length !== data.length
					}
					onChange={() => handleSelectionChange()}
				/>
			),
			getBodyContent: (row) => (
				<Checkbox
					color='primary'
					checked={actions?.select?.selected.includes(data.indexOf(row))}
					onChange={() => handleSelectionChange(data.indexOf(row))}
				/>
			),
			hidden: !actions?.select,
			isCheckbox: true,
		},
		{
			id: 'avatar-image',
			headerContent: 'Image',
			getBodyContent: (row) => (
				<CustomAvatar
					alt={row[schema.identifier]}
					src={getImageUrl(
						schema.name,
						row[schema.identifier],
						row.imageUpdatedAt as never
					)}
					showFallback
				/>
			),
			hidden: !schema.image,
			isImage: true,
		},
		...schema.fieldsArray.map<GeneralTableColumn<z.infer<Zod>>>((field) => ({
			id: String(field.name),
			headerContent: field.label,
			getBodyContent: (row) => getSchemaFieldBodyContent(field, row),
			isSchemaField: true,
			isSortable: true,
		})),
	];

	const rowActions: GeneralTableAction<z.infer<Zod>>[] = [
		...(actions?.custom ?? []),
		{
			name: 'view',
			onClick: (row) => actions?.view?.(row),
			icon: <ViewIcon />,
			label: 'View',
			color: 'success',
			disabled: actions?.disabled,
			hidden: !actions?.view,
		},
		{
			name: 'update',
			onClick: (row) => actions?.update?.(row),
			icon: <UpdateIcon />,
			label: 'Update',
			color: 'info',
			disabled: userType === 'Worker' || actions?.disabled,
			hidden: !actions?.update,
		},
		{
			name: 'delete',
			onClick: (row) => actions?.delete?.(row),
			icon: <DeleteIcon />,
			label: 'Delete',
			color: 'error',
			disabled: userType !== 'Administrator' || actions?.disabled,
			hidden: !actions?.delete,
		},
	];

	return (
		<GeneralTable
			{...{
				columns,
				data,
				controls,
				rowActions,
				fullActionButtons: actions?.fullButtons,
				selected: actions?.select?.selected,
				styles: passedStyles,
				emptyLabel,
				footer,
				defaultSorting,
				isBusy,
				hasPagination,
				disableSorting,
				hasFiltering,
				hasExport,
			}}
		/>
	);
};
