import { Box } from '@mui/material';
import {
	Delete as DeleteIcon,
	FileCopy as DuplicateIcon,
	Add as AddIcon,
	Send as SubmitIcon,
} from '@mui/icons-material';
import { z } from 'zod';
import { useState } from 'react';

import { csx } from '~/app/helpers/style';
import { _localIdSchema, createLocalId } from '~/shared/helpers/data';
import { FormField } from '~/app/components/forms/form-field';
import { CustomButton } from '~/app/components/controls/custom-button';
import { GeneralTable } from '~/app/components/tables/general-table';
import { GeneralDialog } from '~/app/components/dialogs/general-dialog';
import { ResponseTable } from '~/app/components/tables/response-table';
import { isStatusAction, useStatus } from '~/app/hooks/status';

import { formTableStyles as styles } from './form-table.styles';

import type {
	GeneralTableColumn,
	GeneralTableAction,
} from '~/app/components/tables/general-table';
import type { FormTableProps } from './form-table.types';
import type {
	BaseSelectionType,
	FormFieldZodType,
	FormSchemaField,
} from '~/app/schemas';
import type { BulkResponse } from '~/app/helpers/api';

export const FormTable = <
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
	},
	Type extends App.WithLocalId<WorkingObj>
>({
	schema,
	formId,
	lists,
	data,
	onChange,
	controls: passedControls,
	onSubmit,
	styles: passedStyles,
	actions,
	emptyLabel = 'No rows have been added',
	footer,
	defaultSorting,
	isBusy: passedIsBusy,
	hasPagination,
	disableSorting,
}: FormTableProps<Zod, Keys, WorkingObj, Fields, Type>) => {
	const [response, setResponse] = useState<null | BulkResponse<
		App.WithLocalId<z.infer<Zod>>
	>>(null);

	const {
		isBusy: internalIsBusy,
		updateStatus,
		statusJsx,
	} = useStatus({ key: 'form-table-status' });

	const isBusy = passedIsBusy || internalIsBusy;

	/** If an existing row id is passed, that row is duplicated. */
	const addRow = (existing?: Type) => {
		const existingRow = existing?._localId
			? data.find((row) => row._localId === existing._localId)
			: undefined;
		const row = {
			...(existingRow ?? schema.defaultValues),
			_localId: createLocalId(data),
		} as Type;
		onChange([...data, row], { reason: 'add', affected: row });
	};

	const columns = schema.fieldsArray.map<GeneralTableColumn<Type>>((field) => ({
		id: field.name.toString(),
		headerSx: field.type === 'selection' ? styles.dropdownHeader : undefined,
		headerContent: field.label,
		getBodyContent: (row) => (
			<FormField
				field={field as never}
				size='small'
				disabled={isBusy}
				actions={actions?.field?.[field.name]}
				disableActions={actions?.disabled}
				fullButtonActions={actions?.fullButtons}
				options={(lists?.[field.name] ?? []) as never}
				sx={csx(
					passedStyles?.formField,
					field.type === 'boolean' && passedStyles?.formCheckbox,
					field.type === 'selection' && passedStyles?.formDropdown,
					field.type === 'readonly' && passedStyles?.formReadonly,
					(field.type === 'string' ||
						field.type === 'int' ||
						field.type === 'float') &&
						passedStyles?.formTextField,
					styles.textField
				)}
				formValues={
					data.find((current) => row._localId === current._localId) as Type
				}
				noLabel
				onChange={(value) => {
					const affected = data.find(
						({ _localId }) => _localId === row._localId
					);
					if (!affected) return;
					const key = field.name;
					affected[key] = value as Type[Keys];
					const updated = data.map((curr) => {
						return curr === affected ? { ...curr, [key]: value } : curr;
					});
					onChange(updated, { reason: 'update', affected, key });
				}}
			/>
		),
		isSchemaField: true,
		isSortable:
			!disableSorting && (field.type === 'readonly' || field.isSortable),
		isCheckbox: field.type === 'boolean',
	}));

	const controls: JSX.Element[] = [statusJsx];

	if (Array.isArray(passedControls)) controls.push(...passedControls);
	else if (passedControls) controls.push(passedControls);

	if (actions?.add) {
		const props = typeof actions.add === 'object' ? actions.add : undefined;
		controls.push(
			<CustomButton
				key='add-row-action'
				sx={styles.button}
				type='button'
				label={props?.label ?? 'Add Row'}
				icon={<AddIcon />}
				color={'success'}
				disabled={actions.disabled || props?.disabled}
				isBusy={isBusy}
				onClick={() => addRow()}
			/>
		);
	}

	if (actions?.submit) {
		const props =
			typeof actions.submit === 'object' ? actions.submit : undefined;
		controls.push(
			<CustomButton
				key='submit-action'
				sx={styles.button}
				label={props?.label ?? 'Submit'}
				icon={<SubmitIcon />}
				type='submit'
				disabled={actions.disabled || props?.disabled || !data.length}
				isBusy={isBusy}
			/>
		);
	}

	const rowActions: GeneralTableAction<Type>[] = [
		{
			name: 'duplicate',
			icon: <DuplicateIcon />,
			label: 'Duplicate',
			onClick: addRow,
			disabled:
				isBusy ||
				actions?.disabled ||
				(typeof actions?.duplicate === 'object' && actions.duplicate.disabled),
			hidden: !actions?.duplicate,
		},
		{
			name: 'delete',
			icon: <DeleteIcon />,
			label: 'Delete',
			onHeaderClick: () => {
				onChange([], { reason: 'delete-all', affected: data });
			},
			onClick: (row: Type) => {
				const affected = data.find(({ _localId }) => _localId === row._localId);
				if (!affected) return;

				onChange(
					data.filter((curr) => curr !== affected),
					{ reason: 'delete', affected }
				);
			},
			color: 'error',
			disabled:
				isBusy ||
				actions?.disabled ||
				(typeof actions?.delete === 'object' && actions.delete.disabled),
			hidden: !actions?.delete,
		},
	];

	return (
		<Box
			sx={csx(styles.form, passedStyles?.form)}
			component='form'
			id={formId}
			onSubmit={async (event) => {
				try {
					event.preventDefault();
					updateStatus({ type: 'loading' });
					const parseSchema = z.array(
						schema.zod.extend({ _localId: _localIdSchema }).strip()
					);
					const res = await onSubmit(parseSchema.parse(data) as never);
					if (isStatusAction(res)) return updateStatus(res);
					if (typeof res === 'string') {
						return updateStatus({
							type: 'success',
							message: res,
							ephemeral: true,
						});
					}
					if (res) setResponse(res);
					updateStatus({ type: 'idle' });
				} catch (message) {
					updateStatus({ type: 'error', message });
				}
			}}
		>
			<GeneralTable
				columns={columns}
				rowActions={rowActions}
				data={data}
				emptyLabel={emptyLabel}
				styles={passedStyles}
				controls={controls}
				footer={footer}
				fullActionButtons={actions?.fullButtons}
				defaultSorting={defaultSorting as never}
				disableSorting={disableSorting}
				hasPagination={hasPagination}
			/>
			{response && (
				<GeneralDialog
					sx={{ height: '90vh' }}
					title={`${schema.label} Response`}
					maxWidth='lg'
					onClose={() => setResponse(null)}
				>
					<ResponseTable
						schema={schema}
						response={response}
						lists={lists as never}
					/>
				</GeneralDialog>
			)}
		</Box>
	);
};
