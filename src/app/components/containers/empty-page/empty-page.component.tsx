import { Box } from '@mui/material';

import { BackgroundImage } from '~/app/components/media/background-image';
import { csx } from '~/app/helpers/style';

import { emptyPageStyles as styles } from './empty-page.styles';

import type { ReactNode } from 'react';
import type { Mui } from '~/app/types/mui';

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
		<Box sx={styles.container}>
			<BackgroundImage
				opacity={backgroundOpacity ?? 0.5}
				sx={styles.image}
			/>

			<Box sx={csx(styles.box, boxSx)}>{children}</Box>
		</Box>
	);
};
