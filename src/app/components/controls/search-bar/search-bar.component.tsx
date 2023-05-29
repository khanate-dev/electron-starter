import { useEffect, useState } from 'react';
import {
	Box,
	InputAdornment,
	InputBase,
	Stack,
	darken,
	lighten,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

import { csx, getOppositeColor } from '~/app/helpers/style';

export type SearchBarProps = {
	/** the styles to apply on the InputBase component */
	sx?: Mui.SxProp;

	/** the total rows in current view */
	totalRows?: number;

	/** the number of rows filtered by current search */
	filteredRows?: number;

	/** the function to call when the search value changes */
	onChange: (value: string) => void;

	/** should the search bar not be wrapped in a MUI grid component? */
	noContainer?: boolean;
};

export const SearchBar = ({
	sx,
	totalRows,
	filteredRows,
	onChange,
	noContainer,
}: SearchBarProps) => {
	const [value, setValue] = useState<string>('');

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			onChange(value);
		}, 250);
		return () => clearTimeout(timeoutId);
	}, [value, onChange]);

	const content = (
		<>
			{Boolean(value && totalRows && filteredRows !== undefined) && (
				<Box color='primary.main'>
					{filteredRows} matches from {totalRows} rows
				</Box>
			)}

			<InputBase
				type='search'
				placeholder='Search...'
				value={value}
				disabled={totalRows === 0}
				sx={csx(
					{
						minWidth: 300,
						maxWidth: 400,
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
							theme.transitions.create(['background-color', 'border'], {
								duration: theme.transitions.duration.shortest,
								easing: theme.transitions.easing.sharp,
							}),
						'&.Mui-disabled': {
							color: 'grey.500',
							backgroundColor: ({ palette }) =>
								`grey.${palette.mode === 'light' ? 200 : 800}`,
						},
						'> .MuiInputBase-input, > .MuiInputAdornment-root': {
							padding: 0,
							color: 'inherit',
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
					sx
				)}
				startAdornment={
					<InputAdornment position='start'>
						<SearchIcon
							color='inherit'
							sx={{ width: 25, height: 25 }}
						/>
					</InputAdornment>
				}
				onChange={({ target }) => setValue(target.value)}
			/>
		</>
	);

	if (noContainer) return content;

	return (
		<Stack
			sx={{
				display: 'inline-flex',
				flexDirection: 'row',
				width: 'auto',
				alignItems: 'center',
				gap: 1,
			}}
		>
			{content}
		</Stack>
	);
};
