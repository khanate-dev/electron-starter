import {
	ArrowDropDown as ExpandIcon,
	FileDownloadRounded as ExportIcon,
} from '@mui/icons-material';
import { ButtonGroup, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

import { CustomButton } from '~/app/components/controls/custom-button.component';
import { exportToExcel } from '~/app/helpers/export.helpers';
import { getViewColumnValue } from '~/app/helpers/table.helpers';
import { dayjsUtc } from '~/shared/helpers/date.helpers';
import { formatToken } from '~/shared/helpers/format-token.helpers';
import { humanizeToken } from '~/shared/helpers/humanize-token.helpers';
import { addToast } from '~/shared/helpers/toast.helpers';

import type {
	ViewColumnKey,
	ViewColumns,
} from '~/app/components/tables/view-table.component';

export type SchemaExportProps<T extends Obj, Cols extends ViewColumnKey<T>> = {
	fileName: string;
	columns: ViewColumns<T, Cols>;
	totalData: T[];
	visibleData: T[];
};

const modes = ['all', 'visible'] as const;
type Mode = (typeof modes)[number];

export const DataExport = <T extends Obj, Cols extends ViewColumnKey<T>>({
	fileName,
	columns,
	totalData,
	visibleData,
}: SchemaExportProps<T, Cols>) => {
	const [mode, setMode] = useState<Mode>('all');
	const [anchor, setAnchor] = useState<null | HTMLElement>(null);

	const data = mode === 'all' ? totalData : visibleData;
	const labels = {
		all: 'Export All',
		visible: 'Export Visible',
	};

	return (
		<ButtonGroup disabled={!data.length}>
			<CustomButton
				label={labels[mode]}
				icon={<ExportIcon />}
				onClick={() => {
					try {
						const timestamp = dayjsUtc.utc().format('YYYY-MM-DD-HH-mm');
						const viewData = data.map((row) =>
							Object.entries(columns).reduce(
								(obj, [key, type]) => ({
									...obj,
									[humanizeToken(key)]: getViewColumnValue(
										row,
										key,
										type as never,
									),
								}),
								{},
							),
						);
						exportToExcel({
							fileName: `${formatToken(fileName, 'kebab')}-${timestamp}`,
							data: viewData,
						});
						addToast('data exported!', 'success');
					} catch (error) {
						addToast(error);
					}
				}}
			/>
			<CustomButton
				aria-describedby='data-export-popover'
				label={<ExpandIcon />}
				sx={{ paddingInline: 0.5 }}
				onClick={(event) => {
					setAnchor(event.currentTarget);
				}}
			/>
			<Menu
				open={Boolean(anchor)}
				id='data-export-popover'
				anchorEl={anchor}
				variant='selectedMenu'
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				onClose={() => {
					setAnchor(null);
				}}
			>
				{modes.map((current) => (
					<MenuItem
						key={current}
						selected={current === mode}
						sx={{ textTransform: 'capitalize', fontSize: '1em' }}
						onClick={() => {
							setMode(current);
							setAnchor(null);
						}}
					>
						Export {current} data
					</MenuItem>
				))}
			</Menu>
		</ButtonGroup>
	);
};
