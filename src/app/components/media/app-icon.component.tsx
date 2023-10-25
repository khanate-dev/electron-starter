import { BlurOn as NoIcon } from '@mui/icons-material';
import { SvgIcon } from '@mui/material';

import { iconNames } from '../../assets/icons/icon-names';
import spriteHref from '../../assets/icons/sprites.svg';
import { csx } from '../../helpers/style.helpers';

import type { SvgIconProps } from '@mui/material';
import type { IconName } from '../../assets/icons/icon-names';

export type AppIconProps = {
	/** the name of the icon to show. will show a default icon if not found */
	name: IconName;

	/** the props to pass to the `SvgIcon` component */
	iconProps?: SvgIconProps;
};

export const AppIcon = ({ name, iconProps }: AppIconProps) => {
	const props = {
		...iconProps,
		inheritViewBox: true,
		sx: csx({ '& path': { fill: 'currentColor' } }, iconProps?.sx),
	} satisfies SvgIconProps;

	if (!iconNames.includes(name)) {
		return (
			<SvgIcon
				component={NoIcon}
				{...props}
			/>
		);
	}

	return (
		<SvgIcon {...props}>
			<use href={`${spriteHref}#${name}`} />
		</SvgIcon>
	);
};
