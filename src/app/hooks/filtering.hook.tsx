import { Search as SearchIcon } from '@mui/icons-material';
import {
	InputAdornment,
	InputBase,
	Stack,
	Typography,
	darken,
	lighten,
} from '@mui/material';
import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { csx, getOppositeColor } from '~/app/helpers/style.helpers';
import { objectKeys } from '~/shared/helpers/object.helpers';

import type { ReactNode } from 'react';
import type { Mui } from '~/app/types/mui.types';

export type FilterOptions<T extends Obj> = Mui.propsWithSx<{
	/** the data to use for filtering */
	data: T[];

	/** the columns to use for filtering. uses all columns if excluded */
	columns?: (keyof T)[];

	/** is filtering disabled? */
	disabled?: boolean;

	/** hide filtering status text */
	noStatus?: boolean;
}>;

type FilterResponse<T extends Obj> = {
	filteredData: T[];
	filterJsx: ReactNode;
};

export const useFiltering = <T extends Obj>({
	sx,
	data,
	columns: passedColumns,
	disabled,
	noStatus,
}: FilterOptions<T>): FilterResponse<T> => {
	const [params, setParams] = useSearchParams();
	const search = params.get('search');

	const timeoutRef = useRef<NodeJS.Timeout>();

	if (disabled) return { filteredData: data, filterJsx: null };

	const filteredData = search
		? data.filter((row) =>
				(passedColumns ?? objectKeys(row)).some((key) =>
					String(row[key] ?? '')
						.toLowerCase()
						.includes(search.toLowerCase()),
				),
		  )
		: data;

	const isFiltered = data.length > 0 && Boolean(search);

	const filterJsx = (
		<Stack
			direction='row'
			gap={1}
			alignItems='center'
			sx={sx}
		>
			{!noStatus && isFiltered && (
				<Typography
					color='primary'
					variant='body2'
				>
					{filteredData.length} matches from {data.length} rows
				</Typography>
			)}
			<InputBase
				type='search'
				placeholder='Search...'
				defaultValue={search ?? ''}
				disabled={!data.length}
				sx={csx(
					{
						flex: 1,
						color: 'primary.light',
						backgroundColor: (theme) => {
							return theme.palette.mode === 'light'
								? lighten(theme.palette.primary.main, 0.9)
								: darken(theme.palette.primary.main, 0.6);
						},
						borderWidth: 2,
						borderStyle: 'solid',
						borderColor: 'currentcolor',
						borderRadius: 1.5,
						padding: 1,
						transition: (theme) =>
							theme.transitions.create(['background-color', 'border']),
						'&.Mui-disabled': {
							color: 'grey.500',
							backgroundColor: ({ palette }) =>
								`grey.${palette.mode === 'light' ? 200 : 800}`,
						},
						'> .MuiInputBase-input, > .MuiInputAdornment-root': {
							color: 'inherit',
							padding: 0,
						},
						'&:not(.Mui-disabled):hover': {
							backgroundColor: (theme) => {
								return theme.palette.mode === 'light'
									? lighten(theme.palette.primary.main, 0.85)
									: darken(theme.palette.primary.main, 0.65);
							},
							color: 'primary.main',
						},
						'&.Mui-focused': {
							backgroundColor: (theme) => {
								return theme.palette.mode === 'light'
									? lighten(theme.palette.primary.main, 0.75)
									: darken(theme.palette.primary.main, 0.7);
							},
							color: getOppositeColor,
						},
					},
					noStatus && sx,
				)}
				startAdornment={
					<InputAdornment position='start'>
						<SearchIcon />
					</InputAdornment>
				}
				onChange={({ target }) => {
					const { value } = target;
					clearTimeout(timeoutRef.current);
					timeoutRef.current = setTimeout(() => {
						if (!value) params.delete('search');
						else params.set('search', value);
						setParams(params, { replace: true });
					}, 250);
				}}
			/>
		</Stack>
	);

	return { filteredData, filterJsx };
};
