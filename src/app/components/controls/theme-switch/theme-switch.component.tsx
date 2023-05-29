import { IconButton } from '@mui/material';
import {
	WbSunny as LightModeIcon,
	NightsStay as DarkModeIcon,
} from '@mui/icons-material';

import { useDarkMode, toggleDarkMode } from '~/app/contexts/dark-mode';
import { csx } from '~/app/helpers/style';

const buttonSize = 40;
const padding = 5;
const iconSize = buttonSize - padding * 2;

export type ThemeSwitchProps = {
	sx?: Mui.SxProp;
};

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
				sx
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
