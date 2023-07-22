import {
	NightsStay as DarkModeIcon,
	WbSunny as LightModeIcon,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { toggleDarkMode, useDarkMode } from '~/app/contexts/dark-mode';
import { csx } from '~/app/helpers/style';

import type { Mui } from '~/app/types/mui';

const buttonSize = 40;
const padding = 5;
const iconSize = buttonSize - padding * 2;

export type ThemeSwitchProps = Mui.propsWithSx;

export const ThemeSwitch = ({ sx }: ThemeSwitchProps) => {
	const isDarkMode = useDarkMode();

	return (
		<IconButton
			color='primary'
			size='small'
			sx={csx(
				{
					boxShadow: 'none',
					fontSize: '2rem',
					display: 'flex',
					overflow: 'hidden',
					width: buttonSize,
					height: buttonSize,
					padding: `${padding}px`,
					alignItems: 'flex-start',
					transition: (theme) =>
						theme.transitions.create('transform', {
							duration: theme.transitions.duration.shortest,
							easing: theme.transitions.easing.sharp,
						}),
					'& > span': {
						padding: 0,
						width: '100%',
						height: '300%',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
						alignItems: 'center',
						'& .MuiSvgIcon-root': {
							fontSize: 'inherit',
							width: iconSize,
							height: iconSize,
						},
						transition: (theme) =>
							theme.transitions.create('transform', {
								duration: theme.transitions.duration.shortest,
								easing: theme.transitions.easing.sharp,
							}),
						transform: isDarkMode
							? `translateY(-${iconSize * 2}px)`
							: undefined,
					},
					'&:hover': {
						transform: 'scale(1.1)',
					},
				},
				sx,
			)}
			onClick={toggleDarkMode}
		>
			<span>
				<LightModeIcon />
				<DarkModeIcon />
			</span>
		</IconButton>
	);
};
