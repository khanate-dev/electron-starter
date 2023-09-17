import { RemoveCircleOutlineRounded as EmptyIcon } from '@mui/icons-material';
import {
	Box,
	Checkbox,
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
	alpha,
	darken,
	lighten,
	useTheme,
} from '@mui/material';

import { CustomButton } from '~/app/components/controls/custom-button.component';
import { SortButton } from '~/app/components/controls/sort-button.component';
import { PAGINATION_SIZES } from '~/app/constants';
import {
	csx,
	scrollStyles,
	wrappedTextStyle,
} from '~/app/helpers/style.helpers';
import { useFiltering } from '~/app/hooks/filtering.hook';
import { usePagination } from '~/app/hooks/pagination.hook';
import { useSorting } from '~/app/hooks/sorting.hook';
import { humanizeToken } from '~/shared/helpers/humanize-token.helpers';

import type { ButtonProps, TableCellProps } from '@mui/material';
import type { ReactNode } from 'react';
import type { SortDirection } from '~/app/hooks/sorting.hook';
import type { Mui } from '~/app/types/mui.types';
import type { Utils } from '~/shared/types/utils.types';

const generalTableCommonStyles = [
	'container',
	'controls',
	'tableContainer',
	'table',
	'header',
	'body',
	'row',
	'cell',
	'footer',
] as const;

export type GeneralTableCommonStyle = (typeof generalTableCommonStyles)[number];

export type GeneralTableStyles = Partial<
	Record<GeneralTableCommonStyle, Mui.sxProp>
>;

export type GeneralTableColumn<Type extends Obj> = {
	name: string;

	/** the styles for the column */
	styles?: { common?: Mui.sxProp; header?: Mui.sxProp; cell?: Mui.sxProp };

	/** the content to show in the header cell */
	header: ReactNode;

	/** the content to show in the body row cell */
	getCell: (row: Type, index: number) => ReactNode;

	/** the direction to align the contents of the column. @default 'left' */
	align?: 'left' | 'center' | 'right';

	/** can the table be sorted by this column? */
	sortable?: boolean;
};

export type GeneralTableAction<Type extends Obj> = Mui.propsWithSx<{
	name: string;

	/** the label of the action */
	label?: ReactNode;

	/** the callback function for the the action in table header. header will be rendered as action if this is provided. */
	onHeaderClick?: () => void;

	/** the callback function for the action */
	onClick: (row: Type) => void;

	/** the icon to show on the action button */
	icon: ReactNode;

	/** the color of the button */
	color?: ButtonProps['color'];

	/** should the action be disabled? */
	disabled?: boolean;
}>;

export type GeneralTableDefaultSorting = {
	column: PropertyKey;
	direction: SortDirection;
};

export type GeneralTableProps<Type extends Obj> = {
	/** the array of data objects */
	data: Type[];

	/** the details of the table columns */
	columns: GeneralTableColumn<Utils.noInfer<Type>>[];

	/** the actions to show on table rows? */
	rowActions?: GeneralTableAction<Utils.noInfer<Type>>[];

	/** the details for row selections. row selections will be enabled if this is passed in */
	select?: {
		/** the currently selected rows */
		selected: number[];

		/** the function to call when selected rows change. returns selected index and changes */
		onSelection: (selected: number[]) => void;
	};

	/** the label to show on te table if empty */
	emptyLabel?: string;

	/** the styles to apply to table components */
	styles?: GeneralTableStyles;

	/** the table controls to render on top of the table */
	controls?: (
		| JSX.Element
		| ((
				data: Utils.noInfer<Type>[],
				pageData: Utils.noInfer<Type>[],
		  ) => JSX.Element)
	)[];

	/** the status of the table */
	status?: JSX.Element;

	/** the details for the table's footer */
	footer?: TableCellProps[];

	/** the default sorting for the table */
	defaultSorting?: GeneralTableDefaultSorting;

	/** should the action button render as icon buttons? */
	compactActions?: boolean;

	/** is the page calling the table in loading state? */
	isBusy?: boolean;

	/** should the table have filtering? */
	hasFiltering?: boolean;

	/** should the table have pagination? */
	hasPagination?: boolean;

	/** should the sorting be disabled? */
	disableSorting?: boolean;

	/** should the row numbers be shown? */
	showRowNumbers?: boolean;
};

const SMALLEST_PAGINATION = Math.min(...PAGINATION_SIZES);

const getDefaultSorting = <T extends Obj>(
	columns: GeneralTableColumn<T>[],
	{ column, direction }: GeneralTableDefaultSorting,
) => {
	const col = columns.find((curr) => curr.name === column);
	if (!col) return undefined;
	return {
		column: col,
		direction,
	};
};

export const GeneralTable = <Type extends Obj>({
	columns: passedColumns,
	data: passedData,
	rowActions: actions,
	select,
	emptyLabel,
	styles,
	controls,
	status,
	footer,
	defaultSorting,
	compactActions,
	isBusy,
	hasFiltering,
	hasPagination,
	disableSorting,
	showRowNumbers,
}: GeneralTableProps<Type>) => {
	const { palette, transitions } = useTheme();

	const { filterJsx, filteredData } = useFiltering({
		sx: { marginLeft: 'auto' },
		data: passedData,
		disabled: !hasFiltering,
	});

	const { sorting, updateSorting, sortedData } = useSorting(
		filteredData,
		disableSorting,
		defaultSorting
			? getDefaultSorting(passedColumns, defaultSorting)
			: undefined,
	);

	const {
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalRows,
		paginatedData,
	} = usePagination(sortedData, !hasPagination, true);

	const borderColor =
		palette.mode === 'light'
			? lighten(palette.primary.light, 0.7)
			: darken(palette.primary.dark, 0.2);

	const offsetColor = (
		coefficient: number,
		shade: 'primary' | 'secondary' | 'success' = 'primary',
	) => {
		const colorAdjust = palette.mode === 'light' ? lighten : alpha;
		const offsetCoefficient =
			palette.mode === 'light' ? coefficient : 1 - coefficient;
		const color = palette[shade][palette.mode];
		return colorAdjust(color, offsetCoefficient);
	};

	const offset = {
		even: { base: 1, highlight: 0.8 },
		odd: { base: 0.9, highlight: 0.7 },
	};

	const getRowBackground = (parity: 'even' | 'odd', selected?: boolean) => {
		const base = offsetColor(offset[parity].base);
		if (!selected) return base;
		const highlight = offsetColor(offset[parity].highlight);
		return `repeating-linear-gradient(${[
			'-45deg',
			`${base} 0%`,
			`${base} 2%`,
			`${highlight} 2%`,
			`${highlight} 4%`,
		].join(', ')})`;
	};

	const sharedStyles = {
		container: csx(
			{
				flex: 1,
				overflow: 'hidden',
				'& > .MuiAlert-root.showing': { marginBottom: 1 },
			},
			styles?.container,
		),
		cell: csx(
			{
				fontSize: '1.3em',
				border: 'none',
				paddingBlock: 2,
				paddingInline: 1,
				width: 'auto',
				position: 'relative',
				...wrappedTextStyle,
				'@media print': { border: '2px solid gray !important' },
			},
			styles?.cell,
		),
	} satisfies Record<string, Mui.sxProp>;

	const controlsJsx =
		controls || filterJsx ? (
			<Stack
				direction='row'
				sx={csx(
					{
						flex: 0,
						flexWrap: 'wrap',
						alignItems: 'center',
						displayPrint: 'none',
						paddingTop: 1,
						marginBottom: 1,
						gap: 1,
						'> *': { flexShrink: 0 },
						'& > .MuiAutocomplete-root': { minWidth: 200 },
					},
					styles?.controls,
				)}
			>
				{controls?.map((row) =>
					typeof row === 'function' ? row(passedData, paginatedData) : row,
				)}
				{filterJsx}
			</Stack>
		) : null;

	if (paginatedData.length === 0) {
		return (
			<Stack sx={sharedStyles.container}>
				{status}
				{controlsJsx}
				<Stack
					sx={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						opacity: 0.5,
						gap: 2,
						'& .MuiSvgIcon-root': {
							color: 'primary.main',
							fontSize: '8em',
						},
						'& > .MuiTypography-root': {
							color: 'primary.main',
							fontSize: '1.8em',
							textTransform: 'capitalize',
						},
					}}
				>
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
			({ onClick, onHeaderClick, ...action }, idx) => ({
				name: `action-${action.name}`,
				header: onHeaderClick ? (
					<CustomButton
						{...action}
						label={action.label ?? humanizeToken(action.name)}
						isIcon={compactActions}
						disabled={isBusy || action.disabled}
						sx={{
							fontSize: '0.8em',
							paddingInline: 1.5,
							paddingBlock: 0.5,
							'.MuiButton-startIcon': { marginRight: 0.25 },
						}}
						onClick={onHeaderClick}
					/>
				) : !compactActions ? (
					action.label
				) : (
					action.icon
				),
				getCell: (row) => (
					<CustomButton
						{...action}
						label={action.label ?? humanizeToken(action.name)}
						isIcon={compactActions}
						disabled={isBusy || action.disabled}
						sx={{
							fontSize: '0.8em',
							paddingInline: 1.5,
							paddingBlock: 0.5,
							'.MuiButton-startIcon': { marginRight: 0.25 },
						}}
						onClick={() => {
							onClick(row);
						}}
					/>
				),
				align: 'center',
				styles: {
					header: {
						width: (idx === 0 ? 25 : 0) + (compactActions ? 50 : 100),
						padding: 0,
						paddingLeft: idx === 0 ? '25px' : undefined,
					},
					cell: { padding: 0, paddingLeft: idx === 0 ? '25px' : 0 },
				},
			}),
		) ?? []),
	];

	if (showRowNumbers) {
		columns.unshift({
			name: 'row-number',
			header: '#',
			getCell: (row) => passedData.indexOf(row) + 1,
			styles: {
				header: { width: 50 },
			},
		});
	}

	if (select) {
		columns.unshift({
			name: 'row-selection',
			align: 'center',
			header: (
				<Checkbox
					color='default'
					checked={select.selected.length === passedData.length}
					indeterminate={
						Boolean(select.selected.length) &&
						select.selected.length !== passedData.length
					}
					onChange={() => {
						select.onSelection(
							select.selected.length === passedData.length
								? []
								: passedData.map((_, idx) => idx),
						);
					}}
				/>
			),
			getCell: (row) => (
				<Checkbox
					color='primary'
					checked={select.selected.includes(passedData.indexOf(row))}
					onChange={() => {
						const index = passedData.indexOf(row);
						select.onSelection(
							select.selected.includes(index)
								? select.selected.filter((curr) => curr !== index)
								: [...select.selected, index],
						);
					}}
				/>
			),
			styles: {
				common: {
					width: 75,
					padding: 0,
					'& .MuiCheckbox-root': {
						padding: 0,
						'& svg': { width: 25, height: 25 },
					},
				},
			},
		});
	}

	return (
		<Stack sx={sharedStyles.container}>
			{status}
			{controlsJsx}
			<Stack
				flex={1}
				sx={csx(scrollStyles.xy, styles?.tableContainer)}
				borderRadius={1}
			>
				<Table
					sx={csx(
						{
							height: 'fit-content',
							tableLayout: 'fixed',
							marginBlock: 0,
							marginInline: 'auto',
							fontSize: '0.8em',
							borderCollapse: 'collapse',
							overflow: 'hidden',
							'@media print': {
								borderCollapse: 'separate',
								borderSpacing: 3,
							},
						},
						styles?.table,
					)}
				>
					<TableHead sx={styles?.header}>
						<TableRow sx={styles?.row}>
							{columns.map((column) => (
								<TableCell
									key={column.name}
									sx={csx(
										sharedStyles.cell,
										{
											zIndex: 5,
											position: 'sticky',
											backgroundColor: (theme) =>
												theme.palette.primary[theme.palette.mode],
											color: 'primary.contrastText',
											paddingBlock: 0,
											textTransform: 'capitalize',
											textAlign: column.align,
											'@media print': { background: 'gray', color: 'white' },
											'&:hover button': { opacity: 0.7 },
										},
										column.styles?.common,
										column.styles?.header,
										styles?.cell,
									)}
								>
									<Stack
										sx={{
											flexDirection:
												column.align === 'right' ? 'row-reverse' : 'row',
											gap: 0.5,
											alignItems: 'center',
											justifyContent:
												column.align === 'center' ? 'center' : 'flex-start',
										}}
									>
										<Box sx={{ paddingBlock: 2, ...wrappedTextStyle }}>
											{column.header}
										</Box>
										{!disableSorting && column.sortable && (
											<SortButton
												direction={
													sorting.column === column
														? sorting.direction
														: undefined
												}
												onClick={() => {
													updateSorting(column);
												}}
											/>
										)}
									</Stack>
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					<TableBody sx={styles?.body}>
						{paginatedData.map((row, index) => (
							<TableRow
								key={(row._localId as number | undefined) ?? index}
								sx={csx(
									{
										background: getRowBackground(
											index % 2 === 0 ? 'even' : 'odd',
											select?.selected.includes(passedData.indexOf(row)),
										),
										transition: transitions.create('background-color'),
										boxShadow: `inset 0 -2px ${borderColor}`,
										'@media print': { background: 'white', color: 'black' },
									},
									styles?.row,
								)}
							>
								{columns.map((column) => (
									<TableCell
										key={`${(row._localId as number | undefined) ?? index}-${
											column.name
										}`}
										sx={csx(
											sharedStyles.cell,
											{ textAlign: column.align },
											column.styles?.common,
											column.styles?.cell,
											styles?.cell,
										)}
									>
										{column.getCell(row, index)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>

					{(showPagination || footer) && (
						<TableFooter sx={styles?.footer}>
							{footer && (
								<TableRow sx={styles?.row}>
									{footer.map((cell, index) => (
										<TableCell
											key={index}
											{...cell}
											sx={csx(cell.sx, styles?.cell)}
										/>
									))}
								</TableRow>
							)}

							{showPagination && (
								<TableRow sx={styles?.row}>
									<TablePagination
										rowsPerPageOptions={PAGINATION_SIZES as unknown as number[]}
										colSpan={columns.length}
										count={totalRows}
										rowsPerPage={pageSize}
										page={currentPage}
										sx={csx(
											{
												zIndex: 5,
												backgroundColor: borderColor,
												position: 'sticky',
												bottom: 0,
												'@media print': { backgroundColor: 'silver' },
											},
											styles?.cell,
										)}
										onPageChange={(_event, page) => {
											setCurrentPage(page);
										}}
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
