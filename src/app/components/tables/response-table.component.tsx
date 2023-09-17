import {
	AutoFixHigh as ClearIcon,
	HighlightOffRounded as ErrorIcon,
	TaskAltRounded as SuccessIcon,
} from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';

import { CustomButton } from '~/app/components/controls/custom-button.component';
import { CustomAlert } from '~/app/components/feedback/custom-alert.component';
import { InfoTooltip } from '~/app/components/feedback/info-tooltip.component';
import { GeneralTable } from '~/app/components/tables/general-table.component';
import { wrappedTextStyle } from '~/app/helpers/style.helpers';
import { pluralize } from '~/shared/helpers/pluralize.helpers';

import type {
	GeneralTableColumn,
	GeneralTableStyles,
} from '~/app/components/tables/general-table.component';
import type { BulkResponse } from '~/app/helpers/api.helpers';
import type { Mui } from '~/app/types/mui.types';

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

export type ResponseTableProps<T extends Obj> = {
	/** the schema to show the response for */
	columns: GeneralTableColumn<T>[];

	/** the response data to use */
	response: BulkResponse<T>;

	/** the styles to apply to table components */
	styles?: GeneralTableStyles;

	/** the function to call when the response is cleared. Clear button is only rendered if this is passed in */
	onClear?: () => void;
};

export const ResponseTable = <T extends Obj>({
	columns: passedColumns,
	response,
	styles,
	onClear,
}: ResponseTableProps<T>) => {
	const { successful, failed } = response;

	const columns: GeneralTableColumn<T>[] = [
		...passedColumns,
		{
			name: 'status',
			header: 'Status',
			getCell: ({ error }) => {
				if (typeof error !== 'string' || !error)
					return <SuccessIcon color='success' />;
				return (
					<Stack
						direction='row'
						sx={{ gap: 1, paddingInline: 1 }}
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
		<Stack sx={{ gap: 2 }}>
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
				styles={styles}
			/>
		</Stack>
	);
};
