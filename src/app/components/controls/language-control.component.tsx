import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

import { AppIcon } from '~/components/media/app-icon.component';
import { csx } from '~/helpers/style.helpers';
import { updateLanguage, useI18n } from '~/hooks/i18n.hook';
import { languages } from '~/i18n';

import type { Mui } from '~/types/mui.types';

export type LanguageControlProps = Mui.propsWithSx;

export const LanguageControl = ({ sx }: LanguageControlProps) => {
	const { language } = useI18n();

	const [anchor, setAnchor] = useState<null | HTMLElement>(null);

	return (
		<>
			<Button
				aria-describedby='theme-switch-popover'
				variant='outlined'
				startIcon={<AppIcon name='language' />}
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
				{language}
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
				{languages.map((curr) => (
					<MenuItem
						key={curr}
						selected={curr === language}
						sx={{
							textTransform: 'capitalize',
							padding: 1,
							width: 90,
							gap: 1,
							minHeight: 'unset',
						}}
						onClick={() => {
							updateLanguage(curr);
							setAnchor(null);
						}}
					>
						<AppIcon name='language' />
						<Typography variant='body2'>{curr}</Typography>
					</MenuItem>
				))}
			</Menu>
		</>
	);
};
