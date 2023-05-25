import { BlurOn as NoIcon } from '@mui/icons-material';
import { SvgIcon } from '@mui/material';

import { objectEntries } from '~/shared/helpers/object';
import * as icons from '~/app/components/media/icons';
import { formatToken } from '~/shared/helpers/string';

import type { FormatToken } from '~/shared/helpers/string';
import type { SVGProps } from 'react';
import type { SvgIconProps } from '@mui/material';

type IconType = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const extractIcons = <
	T extends Record<string, IconType>,
	Names extends {
		[K in keyof T]: K extends `${infer Name}Icon`
			? FormatToken<Name, 'kebab'>
			: never;
	}[keyof T]
>(
	iconObject: T
) => {
	return objectEntries(iconObject).reduce(
		(object, [name, icon]) => ({
			...object,
			[formatToken(name.replace(/Icon$/u, ''), 'kebab')]: icon,
		}),
		{}
	) as { [K in Names]: IconType };
};

const iconObject = extractIcons(icons);

export type AppIconProps = {
	/** the name of the icon to show. will show a default icon if not found */
	name: keyof typeof iconObject;

	/** the props to pass to the `SvgIcon` component */
	iconProps?: SvgIconProps;
};

export const AppIcon = ({ name: iconName, iconProps }: AppIconProps) => {
	const Component = (iconObject[iconName] as IconType | undefined) ?? NoIcon;
	return (
		<SvgIcon
			component={Component}
			inheritViewBox
			{...iconProps}
			sx={{
				color: 'inherit',
				'& path': {
					color: 'inherit',
					fill: 'currentColor',
				},
			}}
		/>
	);
};
