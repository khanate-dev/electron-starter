import { IconButton, SvgIcon } from '@mui/material';

import type { SortDirection } from '../../hooks/sorting.hook';

export type SortIconProps = {
	direction?: SortDirection;
	onClick: () => void;
};

export const SortButton = ({ direction, onClick }: SortIconProps) => {
	return (
		<IconButton
			sx={{
				width: 25,
				height: 25,
				padding: 0.5,
				opacity: direction ? 0.75 : 0,
				color: 'inherit',
				'& > svg': { width: '100%', height: '100%' },
				'&:hover, &:active': { opacity: 0.75 },
			}}
			onClick={onClick}
		>
			<SvgIcon viewBox='0 0 24 24'>
				<path
					fill='currentColor'
					opacity={direction === 'ascending' ? 1 : 0.5}
					d='M7 3a1 1 0 011 1v13.586l2.293-2.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L6 17.586V4a1 1 0 011-1z'
				/>
				<path
					fill='currentColor'
					opacity={direction === 'descending' ? 1 : 0.5}
					d='M16.293 3.293a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L18 6.414V20a1 1 0 11-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414l4-4z'
				/>
			</SvgIcon>
		</IconButton>
	);
};
