import {
	Add as AddIcon,
	Delete as DeleteIcon,
	FileCopy as DuplicateIcon,
	Send as SubmitIcon,
} from '@mui/icons-material';
import { Stack } from '@mui/material';
import { useState } from 'react';
import { z } from 'zod';

import { GeneralTable } from './general-table.component';
import { ResponseTable } from './response-table.component';

import { CustomButton } from '../controls/custom-button.component';
import { GeneralDialog } from '../dialogs/general-dialog.component';
import { FormField } from '../forms/form-field.component';
import { createLocalId } from '../../helpers/data.helpers';
import { localIdSchema } from '../../helpers/schema.helpers';
import { csx } from '../../helpers/style.helpers';
import { formSchemaToGeneralTableColumns } from '../../helpers/table.helpers';
import { isBulkResponse } from '../../helpers/type.helpers';

import type { Utils } from '../../../shared/types/utils.types';
import type {
	FormSchema,
	FormSelectLists,
	FormSuggestLists,
	FormWorkingObj,
} from '../../classes/form-schema.class';
import type { CustomButtonProps } from '../controls/custom-button.component';
import type {
	GeneralTableAction,
	GeneralTableColumn,
	GeneralTableProps,
	GeneralTableStyles,
} from './general-table.component';
import type { BulkResponse } from '../../helpers/api.helpers';
import type { SortDirection } from '../../hooks/sorting.hook';
import type { StatusUpdate, useStatus } from '../../hooks/status.hook';
import type { App } from '../../types/app.types';
import type { Mui } from '../../types/mui.types';

export type FormTableFormStyles = Partial<
	Record<
		| 'form'
		| 'formField'
		| 'formDropdown'
		| 'formCheckbox'
		| 'formReadonly'
		| 'formTextField',
		Mui.sxProp
	>
>;

export type FormTableStyles = GeneralTableStyles & FormTableFormStyles;

type WorkingRow<T extends FormSchema> = App.withLocalId<FormWorkingObj<T>>;

export type FormTableProps<T extends FormSchema> = Pick<
	GeneralTableProps<WorkingRow<T>>,
	| 'data'
	| 'controls'
	| 'emptyLabel'
	| 'footer'
	| 'hasPagination'
	| 'disableSorting'
> & {
	/** the schema to use */
	schema: T;

	/** the id to apply to the form */
	formId?: string;

	/** the function to call when the table changes */
	onChange: (
		data: WorkingRow<T>[],
		details:
			| { reason: 'delete-all'; affected: WorkingRow<T>[] }
			| { reason: 'add' | 'delete'; affected: WorkingRow<T> }
			| {
					reason: 'update';
					affected: WorkingRow<T>;
					key: keyof WorkingRow<T>;
			  },
	) => void;

	/**
	 * the function to call when the form is submitted
	 * @param parsedData the data parsed with the passed schema
	 * @returns
	 * - `BulkResponse` in a promise to show a detailed response
	 * - `StatusAction` to set the form status to the returned state
	 * - `string` the form status is set to ephemeral `success` with the given string as the message
	 * - `void` the form status is set to idle
	 */
	onSubmit: (
		parsedData: App.withLocalId<T['zod']['_output']>[],
	) => Promise<
		| void
		| string
		| StatusUpdate
		| BulkResponse<App.withLocalId<T['zod']['_output']>>
	>;

	/** the styles to apply to table components. @default {} */
	styles?: FormTableStyles;

	/** status hook to control form state */
	status: Utils.prettify<
		Pick<ReturnType<typeof useStatus>, 'isBusy' | 'asyncWrapper'> &
			Partial<Pick<ReturnType<typeof useStatus>, 'statusJsx'>>
	>;

	/** the form controls to enable */
	actions?: {
		/** should the actions be disabled? */
		disabled?: boolean;

		/** should the actions use an icon button for row actions? */
		compact?: boolean;

		/** should the add action be shown. pass an object to override defaults */
		add?: boolean | Pick<CustomButtonProps, 'label' | 'disabled'>;

		/** should the submit action be shown. pass an object to override defaults */
		submit?: boolean | Pick<CustomButtonProps, 'label' | 'disabled'>;

		/** any additional actions to show */
		custom?: GeneralTableAction<WorkingRow<T>>[];

		/** should the delete action be shown. pass an object to override defaults */
		delete?: boolean | Pick<GeneralTableAction<WorkingRow<T>>, 'disabled'>;

		/** should the duplicate action be shown. pass an object to override defaults */
		duplicate?: boolean | Pick<GeneralTableAction<WorkingRow<T>>, 'disabled'>;
	};

	/** the default sorting for the table */
	defaultSorting?: {
		column: Utils.filteredKeys<
			T['fields'],
			{ type: 'readonly' } | { sortable: true }
		>;
		direction: SortDirection;
	};
} & FormSelectLists<T, true> &
	FormSuggestLists<T>;

export const FormTable = <T extends FormSchema>({
	schema,
	formId,
	selectionLists,
	suggestionLists,
	data,
	onChange,
	controls: passedControls,
	onSubmit,
	styles,
	status: { isBusy, statusJsx, asyncWrapper },
	actions,
	emptyLabel = 'No rows have been added',
	footer,
	defaultSorting,
	hasPagination,
	disableSorting,
}: FormTableProps<T>) => {
	const [response, setResponse] = useState<null | BulkResponse<
		App.withLocalId<T['zod']['_output']>
	>>(null);

	/** If an existing row id is passed, that row is duplicated. */
	const addRow = (existing?: WorkingRow<T>) => {
		const existingRow = existing?._localId
			? data.find((row) => row._localId === existing._localId)
			: undefined;
		const row = {
			...(existingRow ?? schema.defaultValues),
			_localId: createLocalId(data),
		} as WorkingRow<T>;
		onChange([...data, row], { reason: 'add', affected: row });
	};

	const columns = schema.fieldsArray.map<GeneralTableColumn<WorkingRow<T>>>(
		(field) => ({
			name: field.name.toString(),
			styles: {
				header: field.type === 'selection' ? { minWidth: 200 } : undefined,
			},
			header: field.label,
			getCell: (row) => {
				const selection = selectionLists?.[field.name as never] as
					| ((row: WorkingRow<T>) => unknown[])
					| unknown[]
					| undefined;
				const suggestion = suggestionLists?.[field.name as never] as
					| unknown[]
					| undefined;
				return (
					<FormField
						field={field as never}
						size='small'
						disabled={isBusy}
						options={
							(typeof selection === 'function'
								? selection(row)
								: selection ?? suggestion ?? []) as never
						}
						sx={csx(
							{
								width: '100%',
								'& > .MuiOutlinedInput-root.MuiInputBase-adornedEnd': {
									paddingRight: 0,
									'& > .MuiInputAdornment-root': {
										'& .MuiIconButton-root': {
											padding: 1,
											borderRadius: 0,
										},
									},
								},
								'& label': {
									'&.MuiInputLabel-outlined.MuiInputLabel-shrink': {
										transform: 'translate(14px, -4px) scale(0.75)',
									},
								},
								'& input[type=number]': {
									MozAppearance: 'textfield',
								},
								'& input::-webkit-outer-spin-button': {
									WebkitAppearance: 'none',
									margin: 0,
								},
								'& input::-webkit-inner-spin-button': {
									WebkitAppearance: 'none',
									margin: 0,
								},
							},
							styles?.formField,
							field.type === 'boolean' && styles?.formCheckbox,
							field.type === 'selection' && styles?.formDropdown,
							field.type === 'readonly' && styles?.formReadonly,
							['string', 'int', 'float'].includes(field.type) &&
								styles?.formTextField,
						)}
						formValues={
							data.find(
								(current) => row._localId === current._localId,
							) as WorkingRow<T>
						}
						noLabel
						onChange={(value) => {
							const affected = data.find(
								({ _localId }) => _localId === row._localId,
							);
							if (!affected) return;
							const key = field.name;
							affected[key as keyof WorkingRow<T>] = value as never;
							const updated = data.map((curr) => {
								return curr === affected ? { ...curr, [key]: value } : curr;
							});
							onChange(updated, { reason: 'update', affected, key });
						}}
					/>
				);
			},
			sortable:
				!disableSorting && (field.type === 'readonly' || field.sortable),
		}),
	);

	const controls: typeof passedControls = [];
	if (passedControls) controls.push(...passedControls);

	const buttonStyles = { minWidth: 125 } satisfies Mui.sxStyle;

	if (actions?.add) {
		const props = typeof actions.add === 'object' ? actions.add : undefined;
		controls.push(
			<CustomButton
				key='add-row-action'
				sx={buttonStyles}
				type='button'
				label={props?.label ?? 'Add Row'}
				icon={<AddIcon />}
				color='success'
				disabled={actions.disabled || props?.disabled}
				isBusy={isBusy}
				onClick={() => {
					addRow();
				}}
			/>,
		);
	}

	if (actions?.submit) {
		const props =
			typeof actions.submit === 'object' ? actions.submit : undefined;
		controls.push(
			<CustomButton
				key='submit-action'
				sx={buttonStyles}
				label={props?.label ?? 'Submit'}
				icon={<SubmitIcon />}
				type='submit'
				disabled={actions.disabled || props?.disabled || !data.length}
				isBusy={isBusy}
			/>,
		);
	}

	const rowActions = actions?.custom ?? [];
	if (actions?.duplicate) {
		rowActions.push({
			name: 'duplicate',
			icon: <DuplicateIcon />,
			label: 'Duplicate',
			onClick: addRow,
			disabled:
				isBusy ||
				actions.disabled ||
				(typeof actions.duplicate === 'object' && actions.duplicate.disabled),
		});
	}
	if (actions?.delete) {
		rowActions.push({
			name: 'delete',
			icon: <DeleteIcon />,
			label: 'Delete',
			onHeaderClick: () => {
				onChange([], { reason: 'delete-all', affected: data });
			},
			onClick: (row) => {
				const affected = data.find(({ _localId }) => _localId === row._localId);
				if (!affected) return;

				onChange(
					data.filter((curr) => curr !== affected),
					{ reason: 'delete', affected },
				);
			},
			color: 'error',
			disabled:
				isBusy ||
				actions.disabled ||
				(typeof actions.delete === 'object' && actions.delete.disabled),
		});
	}

	return (
		<Stack
			component='form'
			id={formId}
			sx={csx({ flex: 1, overflow: 'hidden', gap: 2 }, styles?.form)}
			onSubmit={(event) => {
				event.preventDefault();
				asyncWrapper('submit', async () => {
					const parseSchema = z.array(
						schema.zod.extend({ _localId: localIdSchema }).strip(),
					);
					const res = await onSubmit(parseSchema.parse(data) as never);
					if (
						isBulkResponse(
							res,
							schema.zod.extend({ _localId: localIdSchema }).strip(),
						)
					)
						setResponse(res);
					else if (typeof res === 'string') return res;
					else if (res) return res;
				});
			}}
		>
			<GeneralTable
				columns={columns}
				rowActions={rowActions}
				data={data}
				emptyLabel={emptyLabel}
				styles={styles}
				status={statusJsx}
				controls={controls}
				footer={footer}
				compactActions={actions?.compact}
				defaultSorting={defaultSorting}
				disableSorting={disableSorting}
				hasPagination={hasPagination}
			/>
			{response && (
				<GeneralDialog
					sx={{ height: '90vh' }}
					title={`${schema.label} Response`}
					maxWidth='lg'
					onClose={() => {
						setResponse(null);
					}}
				>
					<ResponseTable
						columns={formSchemaToGeneralTableColumns(schema, selectionLists)}
						response={response}
						onClear={() => {
							setResponse(null);
						}}
					/>
				</GeneralDialog>
			)}
		</Stack>
	);
};
