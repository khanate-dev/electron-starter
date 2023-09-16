import { Box, keyframes } from '@mui/material';

import { BackgroundImage } from '~/app/components/media/background-image.component';
import { csx } from '~/app/helpers/style.helpers';

import type { ReactNode } from 'react';
import type { Mui } from '~/app/types/mui.types';

const triangleSize = 75;
const decorationDistance = (-1 * triangleSize) / 2;

export type EmptyPageProps = {
	/** the styles to apply to the center box */
	boxSx?: Mui.sxProp;

	/** the opacity of the background image */
	backgroundOpacity?: number;

	/** the contents of the center box */
	children: ReactNode;
};

export const EmptyPage = ({
	boxSx,
	backgroundOpacity,
	children,
}: EmptyPageProps) => {
	return (
		<Box
			sx={{
				display: 'flex',
				width: '100%',
				height: '100%',
				flexWrap: 'nowrap',
				justifyContent: 'center',
				alignItems: 'center',
				position: 'relative',
			}}
		>
			<BackgroundImage
				opacity={backgroundOpacity ?? 0.5}
				sx={{
					height: 'auto',
					width: '95%',
					maxHeight: '95%',
					bottom: 0,
					left: 'unset',
				}}
			/>

			<Box
				sx={csx(
					{
						width: '80%',
						maxWidth: 600,
						borderWidth: 3,
						borderStyle: 'solid',
						borderRadius: 2,
						borderColor: 'grey.400',
						padding: '50px',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
						position: 'relative',
						backgroundColor: 'background.paper',
						opacity: 0.9,
						animationDuration: '0.75s',
						animationTimingFunction: (theme) => theme.transitions.easing.sharp,
						animationName: keyframes({
							'0%': { width: 0, padding: 0 },
							'35%': { width: 0, padding: '50px' },
							'100%': { width: '80%' },
						}).toString(),
						transition: (theme) => theme.transitions.create('transform'),
						'& > *': { overflow: 'hidden', maxWidth: '95%' },
						'&::before, &::after': {
							transition: (theme) =>
								theme.transitions.create(['top', 'left', 'right', 'bottom']),
							content: '""',
							zIndex: -1,
							position: 'absolute',
							borderStyle: 'solid',
							borderWidth: triangleSize,
							borderRadius: 2,
						},
						'&::before': {
							borderTopColor: 'secondary.light',
							borderLeftColor: 'secondary.light',
							borderBottomColor: 'transparent',
							borderRightColor: 'transparent',
							top: decorationDistance,
							left: decorationDistance,
						},
						'&::after': {
							borderTopColor: 'transparent',
							borderLeftColor: 'transparent',
							borderBottomColor: 'secondary.light',
							borderRightColor: 'secondary.light',
							bottom: decorationDistance,
							right: decorationDistance,
						},
						'&:hover': {
							transform: 'scale(1.02)',
							'&::before': {
								top: decorationDistance - 10,
								left: decorationDistance - 10,
							},
							'&::after': {
								bottom: decorationDistance - 10,
								right: decorationDistance - 10,
							},
						},
					},
					boxSx,
				)}
			>
				{children}
			</Box>
		</Box>
	);
};
