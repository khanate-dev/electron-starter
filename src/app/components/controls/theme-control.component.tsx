import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

import { AppIcon } from '~/components/media/app-icon.component';
import { csx } from '~/helpers/style.helpers';
import { modes, updateMode, useStoredMode } from '~/hooks/mode.hook';

import type { Mui } from '~/types/mui.types';

export type ThemeControlProps = Mui.propsWithSx;

export const ThemeControl = ({ sx }: ThemeControlProps) => {
	const mode = useStoredMode();

	const [anchor, setAnchor] = useState<null | HTMLElement>(null);

	return (
		<>
			<Button
				aria-describedby='theme-switch-popover'
				variant='outlined'
				startIcon={<AppIcon name={`${mode}-mode`} />}
				sx={csx(
					{
						flexDirection: 'row',
						textTransform: 'capitalize',
						paddingBlock: 0.5,
						paddingInline: 1,
						width: 90,
						'& > .MuiButton-startIcon': { marginRight: 1 },
					},
					sx,
				)}
				onClick={(event) => {
					setAnchor(event.currentTarget);
				}}
			>
				{mode}
			</Button>
			<Menu
				open={Boolean(anchor)}
				id='theme-switch-popover'
				anchorEl={anchor}
				variant='selectedMenu'
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				onClose={() => {
					setAnchor(null);
				}}
			>
				{modes.map((curr) => (
					<MenuItem
						key={curr}
						selected={curr === mode}
						sx={{
							textTransform: 'capitalize',
							padding: 1,
							width: 90,
							gap: 1,
							minHeight: 'unset',
						}}
						onClick={() => {
							updateMode(curr);
							setAnchor(null);
						}}
					>
						<AppIcon name={`${curr}-mode`} />
						<Typography variant='body2'>{curr}</Typography>
					</MenuItem>
				))}
			</Menu>
		</>
	);
};
