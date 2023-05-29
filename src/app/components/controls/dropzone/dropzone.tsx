import { useState } from 'react';
import { Box, Stack, alpha } from '@mui/material';

import { csx } from '~/app/helpers/style';

export type DropzoneProps = {
	/** the styles to apply on the container */
	sx?: Mui.SxProp;

	/** the function to call when data or files are dropped */
	onDrop: (dataTransfer: DataTransfer) => void;

	children?: React.Node;
};

export const Dropzone = ({ sx, onDrop, children }: DropzoneProps) => {
	const [dropping, setDropping] = useState(false);

	return (
		<Stack
			sx={csx(
				{
					flexWrap: 'nowrap',
					position: 'relative',
					gap: 1,
				},
				sx
			)}
			onDragEnter={() => setDropping(true)}
			onDragOver={(event) => event.preventDefault()}
			onDrop={(event) => {
				event.preventDefault();
				onDrop(event.dataTransfer);
				setDropping(false);
			}}
		>
			<Box
				sx={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					transition: (theme) => theme.transitions.create('opacity'),
					borderRadius: 2,
					color: 'divider',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					fontSize: '10em',
					fontWeight: 'bold',
					textTransform: 'uppercase',
					textAlign: 'center',
					lineHeight: 0.9,
					zIndex: dropping ? 2 : 0,
					opacity: dropping ? 0.8 : 0,
					background: dropping
						? ({ palette }) =>
								`repeating-linear-gradient(${[
									'45deg',
									`${alpha(palette.primary.light, 0.25)} 0%`,
									`${alpha(palette.primary.light, 0.25)} 5%`,
									`${alpha(palette.primary.dark, 0.25)} 5%`,
									`${alpha(palette.primary.dark, 0.25)} 10%`,
								].join(', ')})`
						: 'transparent',
				}}
				onDragLeave={() => setDropping(false)}
			>
				Drop Here
			</Box>
			{children}
		</Stack>
	);
};
