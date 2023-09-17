import {
	AutoFixHigh as ClearIcon,
	FileDownloadRounded as DownloadIcon,
	Send as SubmitIcon,
} from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { read, utils } from 'xlsx';
import { z } from 'zod';

import { SimpleAccordion } from '~/app/components/containers/simple-accordion.component';
import { CustomButton } from '~/app/components/controls/custom-button.component';
import { Dropzone } from '~/app/components/controls/dropzone.component';
import { FileUploadButton } from '~/app/components/controls/file-upload-button.component';
import { CustomAlert } from '~/app/components/feedback/custom-alert.component';
import { GeneralTable } from '~/app/components/tables/general-table.component';
import { ResponseTable } from '~/app/components/tables/response-table.component';
import { exportToExcel } from '~/app/helpers/export.helpers';
import { formSchemaToGeneralTableColumns } from '~/app/helpers/table.helpers';
import { useStatus } from '~/app/hooks/status.hook';
import { stringifyError } from '~/shared/errors';
import { formatToken } from '~/shared/helpers/format-token.helpers';
import { pluralize } from '~/shared/helpers/pluralize.helpers';
import { readableTypeOf } from '~/shared/helpers/type.helpers';

import type { ReactNode } from 'react';
import type {
	FormSchema,
	FormSelectLists,
} from '~/app/classes/form-schema.class';
import type { BulkResponse } from '~/app/helpers/api.helpers';
import type { Mui } from '~/app/types/mui.types';

export type SchemaImportProps<T extends FormSchema> = FormSelectLists<
	T,
	true
> & {
	/** the schema to use */
	schema: T;

	/** the callback for form submission. the returned response will be shown on the page */
	onImport: (
		data: T['zod']['_output'][],
		raw: Obj[],
	) => Promise<BulkResponse<T['zod']['_output']> | undefined | void>;

	/** should importing be disabled? */
	disabled?: boolean;

	/** is the page calling the component busy? */
	isBusy?: boolean;
};

type State<T extends Obj> =
	| { step: 'start' }
	| {
			step: 'imported';
			data: {
				valid: T[];
				invalid: {
					[K in keyof T]: T[K] | ReactNode;
				}[];
				raw: Obj[];
			};
	  }
	| { step: 'response'; response: BulkResponse<T> };

export const SchemaImport = <T extends FormSchema>({
	schema,
	selectionLists,
	onImport,
	disabled: passedDisabled,
	isBusy: isParentBusy,
}: SchemaImportProps<T>) => {
	const { isBusy: isLocalBusy, statusJsx, asyncWrapper } = useStatus();

	const isBusy = isLocalBusy || isParentBusy;

	const [state, setState] = useState<State<T['zod']['_output']>>({
		step: 'start',
	});

	const disabled = passedDisabled || isBusy;

	const fields = schema.fieldsArray.filter((field) => !field.noImport);

	const handleImport = (files: null | FileList) => {
		asyncWrapper('load', async () => {
			const buffer = await files?.item(0)?.arrayBuffer();
			const workbook = read(buffer, {
				cellDates: true,
			});
			const worksheet = workbook.Sheets[workbook.SheetNames[0] ?? ''];
			if (!worksheet) throw new Error('No data found in the file');
			const rows = utils.sheet_to_json<Record<string, unknown>>(worksheet);

			const result: {
				valid: T['zod']['_output'][];
				invalid: {
					[K in keyof T['zod']['_output']]: T['zod']['_output'][K] | ReactNode;
				}[];
				raw: Obj[];
			} = {
				valid: [],
				invalid: [],
				raw: [],
			};

			for (const row of rows) {
				const object: Obj = {};
				let isError = false;

				for (const field of fields) {
					const name = field.name.toString();
					const passedVal = row[field.importName ?? name];
					const type = readableTypeOf(passedVal);
					let value;
					try {
						if (field.type === 'selection') {
							const selectionList =
								selectionLists?.[name as keyof typeof selectionLists] ?? [];
							const options = (
								typeof selectionList === 'function'
									? selectionList(row as never)
									: (selectionList as unknown) ?? []
							) as { value: unknown; label: unknown }[];
							if (!options.length)
								throw new Error(`No valid options provided for ${name}`);
							if (field.isMultiSelect) {
								const matched = [];
								const parsed = z
									.preprocess(
										(val) => JSON.parse(String(val)),
										z.array(z.string()),
									)
									.safeParse(passedVal);
								if (!parsed.success) {
									throw new Error(
										`Expected JSON array string, received '${type}'`,
									);
								}
								const list = parsed.data;
								if (!list.length && !field.notRequired)
									throw new Error(`bad value! array is empty`);

								for (const item of list) {
									let curr: unknown;
									for (const option of options) {
										// eslint-disable-next-line max-depth
										if (JSON.stringify(option.label) !== item) continue;
										curr = option.value;
										break;
									}
									if (!curr && !field.notRequired)
										throw new Error(`bad value!`);
									matched.push(curr);
								}
								value = matched;
							} else {
								let matched: unknown;
								for (const option of options) {
									if (option.label !== passedVal) continue;
									matched = option.value;
									break;
								}
								if (!matched) {
									if (
										field.notRequired &&
										(passedVal === undefined || passedVal === null)
									)
										value = null;
									else throw new Error(`bad value!`);
								} else {
									value = matched;
								}
							}
						} else {
							// TODO the date type fields are problematic with excel. Review this implementation
							const zod = schema.zod.shape[field.name] as z.ZodSchema;
							const res = zod.safeParse(passedVal);

							if (!field.notRequired && !res.success) {
								throw new Error(
									passedVal
										? `Expected '${field.type}', received '${type}'`
										: 'Required',
								);
							}
							value = res.success ? (res.data as unknown) : null;
						}
						object[name] = value;
					} catch (error) {
						isError = true;
						object[name] = (
							<>
								<Typography
									variant='inherit'
									color='error'
								>
									{String(passedVal ?? 'null')}
								</Typography>
								<Typography
									variant='inherit'
									color='text.disabled'
									fontWeight='medium'
								>
									{stringifyError(error)}
								</Typography>
							</>
						);
					}
				}

				if (isError) {
					result.invalid.push(object as (typeof result.invalid)[number]);
					continue;
				}
				result.valid.push(object as (typeof result.valid)[number]);
				result.raw.push(row);
			}

			setState({ step: 'imported', data: result });
		});
	};

	const tableColumns = formSchemaToGeneralTableColumns(
		schema,
		selectionLists as never,
	);

	const alertStyles = {
		fontSize: '0.8em',
		borderWidth: 1,
		padding: 1,
		'& > .MuiAlert-message > span': {
			display: 'inline-flex',
			paddingInline: 1,
			paddingBlock: 0.5,
			borderRadius: 0.5,
			marginRight: 0.5,
			backgroundColor: 'action.selected',
			textTransform: 'none',
		},
	} satisfies Mui.sxStyle;

	return (
		<>
			{statusJsx}

			{state.step === 'start' && (
				<Dropzone
					sx={{
						flexGrow: 1,
						flexShrink: 1,
						padding: 4,
						gap: 2,
						justifyContent: 'center',
						alignItems: 'center',
						width: '100%',
						maxWidth: 750,
						maxHeight: 500,
						margin: 'auto',
						backgroundColor: 'background.default',
						borderRadius: 2,
						borderColor: 'currentColor',
						borderWidth: 2,
						borderStyle: 'dashed',
						color: 'text.secondary',
						textTransform: 'capitalize',
						transition: (theme) =>
							theme.transitions.create(['background-color', 'border']),
					}}
					onDrop={(transfer) => {
						handleImport(transfer.files);
					}}
				>
					<Typography
						fontSize='2em'
						variant='h5'
					>
						welcome to {schema.label} import!
					</Typography>

					<Typography
						fontSize='1.2em'
						marginBottom={4}
						variant='body1'
					>
						select or drop a file here to continue
					</Typography>

					<FileUploadButton
						name='import-file'
						disabled={disabled}
						size='large'
						isBusy={isBusy}
						onChange={({ target }) => {
							handleImport(target.files);
						}}
					/>

					<CustomButton
						icon={<DownloadIcon />}
						variant='outlined'
						label='Download Template'
						disabled={disabled}
						onClick={() => {
							asyncWrapper('submit', () => {
								const fileName = `${formatToken(
									schema.label,
									'kebab',
								)}-template`;
								const columnNames = fields.map(
									(row) => row.importName ?? row.name,
								);
								exportToExcel({
									fileName,
									data: [columnNames],
									skipHeader: true,
								});
								return 'data exported!';
							});
						}}
					/>
				</Dropzone>
			)}

			{state.step === 'imported' && state.data.invalid.length > 0 && (
				<SimpleAccordion
					title='errors'
					defaultExpanded={!state.data.valid.length}
					subtitle={
						<CustomAlert
							sx={alertStyles}
							severity='error'
							message={
								<>
									<span>{state.data.invalid.length}</span>
									{pluralize`${[
										state.data.invalid.length,
									]} row[|s] with errors`}
								</>
							}
						/>
					}
				>
					<GeneralTable
						columns={tableColumns}
						data={state.data.invalid}
						styles={{ cell: { paddingBlock: 1.5 } }}
					/>
				</SimpleAccordion>
			)}

			{state.step === 'imported' && (
				<>
					<Stack
						sx={{ alignItems: 'center', gap: 2 }}
						direction='row'
					>
						<CustomAlert
							sx={alertStyles}
							severity={state.data.valid.length ? 'success' : 'error'}
							message={
								<>
									<span>{state.data.valid.length}</span>
									{pluralize`${[state.data.valid.length]} valid row[|s] found`}
								</>
							}
						/>
						<CustomButton
							label='Submit'
							isBusy={isBusy}
							disabled={disabled || !state.data.valid.length}
							icon={<SubmitIcon />}
							onClick={() => {
								asyncWrapper('submit', async () => {
									const body = state.data.valid.map((row) =>
										schema.zod.parse(row),
									) as T['zod']['_output'][];
									const response = await onImport(body, state.data.raw);
									if (response) setState({ step: 'response', response });
									return 'import successful!';
								});
							}}
						/>
						<CustomButton
							sx={{ width: 'fit-content' }}
							label='Clear'
							variant='outlined'
							icon={<ClearIcon />}
							color='error'
							onClick={() => {
								setState({ step: 'start' });
							}}
						/>
					</Stack>
					<GeneralTable
						columns={tableColumns}
						data={state.data.valid}
					/>
				</>
			)}

			{state.step === 'response' && (
				<ResponseTable
					columns={tableColumns}
					response={state.response}
					onClear={() => {
						setState({ step: 'start' });
					}}
				/>
			)}
		</>
	);
};
