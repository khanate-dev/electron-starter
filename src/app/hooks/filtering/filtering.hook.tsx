import { useState } from 'react';
import { Box, Grid as Stack } from '@mui/material';

import { objectValues } from '~/shared/helpers/object';
import { SearchBar } from '~/app/components/controls/search-bar';

import type { Dispatch, SetStateAction } from 'react';

type FilterResponse<Type extends Obj> = {
	searchString: string;
	setSearchString: Dispatch<SetStateAction<string>>;
	filteredData: Type[];
	filterJsx: React.Node;
};

export const useFiltering = <Type extends Obj>(
	data: Type[],
	disabled?: boolean
): FilterResponse<Type> => {
	const [searchString, setSearchString] = useState('');

	if (disabled) {
		return {
			searchString,
			setSearchString,
			filteredData: data,
			filterJsx: null,
		};
	}

	const filteredData = searchString
		? data.filter(
				(row) =>
					!searchString ||
					objectValues(row).some((value) =>
						(typeof value === 'boolean'
							? value
								? 'Yes'
								: 'No'
							: String(value ?? '')
						)
							.toLowerCase()
							.includes(searchString.toLowerCase())
					)
		  )
		: data;

	const isFiltered = data.length > 0 && Boolean(searchString);

	const filterJsx = (
		<Stack
			sx={{
				display: 'inline-flex',
				width: 'auto',
				alignItems: 'center',
				gap: 1,
				marginLeft: 'auto',
			}}
			container
		>
			{isFiltered && (
				<Box sx={{ color: 'primary.main' }}>
					{filteredData.length} matches from {data.length} rows
				</Box>
			)}

			<SearchBar
				totalRows={data.length}
				noContainer
				onChange={setSearchString}
			/>
		</Stack>
	);

	return {
		searchString,
		setSearchString,
		filteredData,
		filterJsx,
	};
};
