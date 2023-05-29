import { Box, Stack, Typography } from '@mui/material';
import {
	HighlightOffRounded as ErrorIcon,
	TaskAltRounded as SuccessIcon,
} from '@mui/icons-material';

import { pluralize } from '~/shared/helpers/string';
import { CustomAlert } from '~/app/components/feedback/custom-alert';
import { GeneralTable } from '~/app/components/tables/general-table';
import { InfoTooltip } from '~/app/components/feedback/info-tooltip';
import { schemaToGeneralTableColumns } from '~/shared/helpers/schema';

import type { FormSchema, FormSchemaLists, ViewSchema } from '~/app/schemas';
import type { BulkResponse } from '~/app/helpers/api';
import type { z } from 'zod';

const alertStyle = {
	gap: 0.5,
	fontSize: '0.9em',
	borderWidth: 1,
	paddingBlock: 0.5,
	'& > .MuiAlert-message > span': {
		display: 'inline-flex',
		paddingInline: 1,
		paddingBlock: 0.5,
		borderRadius: 0.5,
		marginRight: 0.5,
		backgroundColor: 'action.selected',
		textTransform: 'none',
	},
} satisfies Mui.SxStyle;

export type ResponseTableProps<
	T extends FormSchema<any, any, any, any> | ViewSchema<any, any, any, any>
> = {
	/** the schema to show the response for */
	schema: T;

	/** the response data to use */
	response: T extends FormSchema<any, any, any, any>
		?
				| BulkResponse<App.WithLocalId<z.infer<T['zod']>>>
				| BulkResponse<z.infer<T['zod']>>
		: BulkResponse<z.infer<T['zod']>>;
} & (T extends FormSchema<any, any, any, any>
	? FormSchemaLists<T['zod'], keyof T['zod']['shape'], any, T['fields']>
	: { lists?: never });

export const ResponseTable = <
	T extends FormSchema<any, any, any, any> | ViewSchema<any, any, any, any>
>({
	schema,
	response,
	lists,
}: ResponseTableProps<T>) => {
	const columns = schemaToGeneralTableColumns(
		schema.fields as never,
		lists as never
	);

	const { successful, failed } = response as BulkResponse;

	columns.push({
		id: 'status',
		headerContent: 'Status',
		getBodyContent: ({ error }) => {
			if (typeof error !== 'string' || !error)
				return <SuccessIcon color='success' />;
			return (
				<Stack
					direction='row'
					sx={{ gap: 1, paddingInline: 1 }}
				>
					<ErrorIcon color='error' />
					<Box
						sx={{
							fontSize: '0.9em',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{error}
					</Box>
					<InfoTooltip
						title={error}
						placement='top-end'
					/>
				</Stack>
			);
		},
	});

	return (
		<Stack sx={{ gap: 2 }}>
			<Stack
				sx={{
					flexDirection: 'row',
					alignItems: 'center',
					gap: 2,
				}}
			>
				<Typography
					sx={{
						color: 'text.secondary',
						fontSize: '1.3em',
					}}
				>
					Response
				</Typography>

				<CustomAlert
					sx={alertStyle}
					severity={successful.length ? 'success' : 'error'}
					message={
						<>
							<span>{successful.length}</span>
							{pluralize`${[successful.length]} submission[|s] successful`}
						</>
					}
				/>

				{failed.length > 0 && (
					<CustomAlert
						sx={alertStyle}
						severity='error'
						message={
							<>
								<span>{failed.length}</span>
								{pluralize`${[failed.length]} submission[|s] failed`}
							</>
						}
					/>
				)}
			</Stack>

			<GeneralTable
				columns={columns}
				data={[...successful, ...failed]}
			/>
		</Stack>
	);
};
