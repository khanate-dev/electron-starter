import { Avatar } from '@mui/material';

import { csx, getOppositeColor } from '../../helpers/style.helpers';

import type { AvatarProps } from '@mui/material';

export type CustomAvatarProps = AvatarProps & {
	/** should the initial of the alt be shown as fallback if the src is not valid? */
	showFallback?: boolean;

	/** the width and height of the image, in pixels */
	size?: number;
};

export const CustomAvatar = ({
	sx,
	showFallback,
	size,
	...avatarProps
}: CustomAvatarProps) => {
	return (
		<Avatar
			{...avatarProps}
			sx={csx(
				{
					height: size,
					width: size,
					backgroundColor: ({ palette }) => `primary.${palette.mode}`,
					borderWidth: 2,
					borderStyle: 'solid',
					borderColor: 'currentColor',
					color: getOppositeColor,
					fontWeight: 'bold',
					fontSize: '1.5rem',
				},
				sx,
			)}
		>
			{showFallback && avatarProps.alt?.[0]?.toUpperCase()}
		</Avatar>
	);
};
