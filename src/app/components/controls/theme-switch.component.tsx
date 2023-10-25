import { IconButton, Stack } from '@mui/material';

import { AppIcon } from '../media/app-icon.component';
import { csx } from '../../helpers/style.helpers';
import { toggleMode, useStoredMode } from '../../hooks/mode.hook';

import type { Mui } from '../../types/mui.types';

const buttonSize = 40;
const padding = 5;
const iconSize = buttonSize - padding * 2;

export type ThemeSwitchProps = Mui.propsWithSx;

export const ThemeSwitch = ({ sx }: ThemeSwitchProps) => {
	const mode = useStoredMode();

	return (
		<IconButton
			color='primary'
			size='small'
			sx={csx(
				{
					overflow: 'hidden',
					width: buttonSize,
					height: buttonSize,
					padding: `${padding}px`,
					transition: (theme) => theme.transitions.create('transform'),
					'&:hover': { transform: 'scale(1.1)' },
				},
				sx,
			)}
			onClick={() => {
				toggleMode();
			}}
		>
			<Stack
				sx={{
					height: '500%',
					justifyContent: 'space-between',
					'& > svg': { width: iconSize, height: iconSize },
					transition: (theme) => theme.transitions.create('transform'),
					transform:
						mode === 'system'
							? 'translateY(40%)'
							: mode === 'dark'
							? 'translateY(-40%)'
							: undefined,
				}}
			>
				<AppIcon name='system-mode' />
				<AppIcon name='light-mode' />
				<AppIcon name='dark-mode' />
			</Stack>
		</IconButton>
	);
};
