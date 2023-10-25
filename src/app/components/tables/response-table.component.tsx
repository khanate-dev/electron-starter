import {
	AutoFixHigh as ClearIcon,
	HighlightOffRounded as ErrorIcon,
	TaskAltRounded as SuccessIcon,
} from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';

import { CustomButton } from '~/components/controls/custom-button.component';
import { CustomAlert } from '~/components/feedback/custom-alert.component';
import { InfoTooltip } from '~/components/feedback/info-tooltip.component';
import { GeneralTable } from '~/components/tables/general-table.component';
import { pluralize } from '~/helpers/pluralize.helpers';
import { wrappedTextStyle } from '~/helpers/style.helpers';

import type {
	GeneralTableColumn,
	GeneralTableProps,
} from '~/components/tables/general-table.component';
import type { BulkResponse } from '~/helpers/api.helpers';
import type { Mui } from '~/types/mui.types';

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
} satisfies Mui.sxStyle;

export type ResponseTableProps<T extends Obj> = Pick<
	GeneralTableProps<T>,
	'columns' | 'styles' | 'hasPagination' | 'hasFiltering'
> & {
	/** the response data to use */
	response: BulkResponse<T>;

	/** the function to call when the response is cleared. Clear button is only rendered if this is passed in */
	onClear?: () => void;
};

export const ResponseTable = <T extends Obj>({
	columns: passedColumns,
	response,
	onClear,
	...tableProps
}: ResponseTableProps<T>) => {
	const { successful, failed } = response;

	const columns: GeneralTableColumn<T>[] = [
		...passedColumns,
		{
			name: 'status',
			header: 'Status',
			align: 'center',
			getCell: ({ error }) => {
				if (typeof error !== 'string' || !error)
					return <SuccessIcon color='success' />;
				return (
					<Stack
						direction='row'
						sx={{
							gap: 1,
							paddingInline: 1,
							maxWidth: 200,
							marginInline: 'auto',
						}}
					>
						<ErrorIcon color='error' />
						<Box sx={{ fontSize: '0.9em', ...wrappedTextStyle }}>{error}</Box>
						<InfoTooltip
							title={error}
							placement='top-end'
						/>
					</Stack>
				);
			},
		},
	];

	return (
		<Stack sx={{ gap: 2, width: '100%' }}>
			<Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
				<Typography sx={{ color: 'text.secondary', fontSize: '1.3em' }}>
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
				{onClear && (
					<CustomButton
						label='clear'
						icon={<ClearIcon />}
						size='small'
						color='error'
						variant='outlined'
						onClick={onClear}
					/>
				)}
			</Stack>

			<GeneralTable
				columns={columns}
				data={[...successful, ...failed]}
				{...tableProps}
			/>
		</Stack>
	);
};
