import {
	Box,
	CircularProgress,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
} from '@mui/material';
import {
	ArrowUpwardRounded as SortDescendingIcon,
	ArrowDownwardRounded as SortAscendingIcon,
	RemoveCircleOutlineRounded as EmptyIcon,
} from '@mui/icons-material';

import { PAGINATION_SIZES } from '~/app/config';
import { usePagination } from '~/app/hooks/pagination';
import { useSorting } from '~/app/hooks/sorting';
import { useFiltering } from '~/app/hooks/filtering';
import { csx } from '~/app/helpers/style';
import { humanizeToken } from '~/shared/helpers/string';
import { CustomButton } from '~/app/components/controls/custom-button';

import { generalTableCommonStyles } from './general-table.types';
import { generalTableStyles as styles } from './general-table.styles';

import type {
	GeneralTableStyles,
	GeneralTableProps,
	GeneralTableColumn,
} from './general-table.types';

const SMALLEST_PAGINATION = Math.min(...PAGINATION_SIZES);

export const GeneralTable = <Type extends Obj>({
	columns: passedColumns,
	data: passedData,
	rowActions: actions,
	selected,
	emptyLabel,
	styles: passedStyles,
	controls,
	footer,
	defaultSorting,
	fullActionButtons,
	isBusy,
	hasFiltering,
	hasPagination,
	disableSorting,
}: GeneralTableProps<Type>) => {
	const tableStyles = generalTableCommonStyles.reduce(
		(object, style) => ({
			...object,
			[style]: csx(styles[style], passedStyles?.[style]),
		}),
		{} as Required<GeneralTableStyles>
	);

	const { filterJsx, filteredData } = useFiltering(passedData, !hasFiltering);

	const { sorting, updateSorting, sortedData } = useSorting(
		filteredData,
		disableSorting,
		defaultSorting
	);

	const {
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalRows,
		paginatedData,
	} = usePagination(sortedData, !hasPagination, true);

	const controlsJsx =
		controls || filterJsx ? (
			<Stack
				direction='row'
				sx={tableStyles.controls}
			>
				{controls}
				{filterJsx}
			</Stack>
		) : null;

	if (paginatedData.length === 0) {
		return (
			<Stack sx={styles.container}>
				{controlsJsx}
				<Stack sx={styles.emptyContent}>
					{isBusy ? (
						<CircularProgress
							size={75}
							thickness={5}
							color='primary'
						/>
					) : (
						<>
							<EmptyIcon />
							<Typography>{emptyLabel ?? 'No data to show'}</Typography>
						</>
					)}
				</Stack>
			</Stack>
		);
	}

	const showPagination = hasPagination && totalRows > SMALLEST_PAGINATION;

	const columns = [
		...passedColumns,
		...(actions?.map<GeneralTableColumn<Type>>(
			({ onClick, onHeaderClick, hidden, ...action }) => ({
				id: `action-${action.name}`,
				headerContent: onHeaderClick ? (
					<CustomButton
						{...action}
						label={action.label ?? humanizeToken(action.name)}
						isIcon={!fullActionButtons}
						disabled={Boolean(isBusy || action.disabled)}
						onClick={onHeaderClick}
					/>
				) : (
					action.label
				),
				getBodyContent: (row) => (
					<CustomButton
						{...action}
						label={action.label ?? humanizeToken(action.name)}
						isIcon={!fullActionButtons}
						disabled={isBusy || action.disabled}
						onClick={() => onClick(row)}
					/>
				),
				hidden,
				isAction: true,
			})
		) ?? []),
	].filter((row) => !row.hidden);

	return (
		<Stack sx={tableStyles.container}>
			{controlsJsx}
			<Stack
				className='scroll-xy'
				sx={tableStyles.tableContainer}
			>
				<Table sx={tableStyles.table}>
					<TableHead sx={tableStyles.header}>
						<TableRow sx={tableStyles.row}>
							{columns.map((column) => (
								<TableCell
									key={column.id}
									sx={csx(
										tableStyles.cell,
										column.headerSx,
										column.isSchemaField && styles.schemaFieldHeader,
										column.isAction && styles.actionHeader,
										column.isAction &&
											fullActionButtons &&
											styles.fullActionHeader,
										column.isImage && styles.imageHeader,
										column.isCheckbox && styles.checkboxHeader,
										column.isRowNumber && styles.rowNumberHeader
									)}
								>
									<>
										{column.headerContent}
										{!disableSorting && column.isSortable && (
											<Box
												component='span'
												data-active={sorting.column === column.id}
												onClick={() => updateSorting(column.id)}
											>
												{sorting.column !== column.id ||
												sorting.direction !== 'descending' ? (
													<SortAscendingIcon />
												) : (
													<SortDescendingIcon />
												)}
											</Box>
										)}
									</>
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					<TableBody sx={tableStyles.body}>
						{paginatedData.map((row, index) => (
							<TableRow
								key={(row._localId as number | undefined) ?? index}
								sx={tableStyles.row}
								className={
									selected?.includes(passedData.indexOf(row))
										? 'selected'
										: undefined
								}
							>
								{columns.map((column) => (
									<TableCell
										key={`${(row._localId as number | undefined) ?? index}-${
											column.id
										}`}
										sx={csx(
											tableStyles.cell,
											column.bodySx,
											column.isSchemaField && styles.schemaFieldCell,
											column.isAction && styles.actionCell,
											column.isImage && styles.imageCell,
											column.isCheckbox && styles.checkboxCell,
											column.isRowNumber && styles.rowNumberCell
										)}
									>
										{column.getBodyContent(row, index)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>

					{(showPagination || footer) && (
						<TableFooter sx={tableStyles.footer}>
							{footer && (
								<TableRow sx={tableStyles.row}>
									{footer.map((cell, index) => (
										<TableCell
											key={index}
											{...cell}
											sx={csx(styles.cell, cell.sx)}
										/>
									))}
								</TableRow>
							)}

							{showPagination && (
								<TableRow sx={tableStyles.row}>
									<TablePagination
										sx={tableStyles.cell}
										rowsPerPageOptions={PAGINATION_SIZES as unknown as number[]}
										colSpan={columns.length}
										count={totalRows}
										rowsPerPage={pageSize}
										page={currentPage}
										onPageChange={(_event, page) => setCurrentPage(page)}
										onRowsPerPageChange={({ target }) => {
											const newSize = Number(target.value);
											if (!PAGINATION_SIZES.includes(newSize)) return;
											setPageSize(newSize as typeof pageSize);
										}}
									/>
								</TableRow>
							)}
						</TableFooter>
					)}
				</Table>
			</Stack>
		</Stack>
	);
};
