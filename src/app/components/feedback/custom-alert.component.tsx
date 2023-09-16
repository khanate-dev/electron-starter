import { Alert, alpha } from '@mui/material';

import { csx, wrappedTextStyle } from '~/app/helpers/style.helpers';

import type { AlertProps } from '@mui/material';
import type { ReactNode } from 'react';

export type CustomAlertProps = Omit<AlertProps, 'children' | 'severity'> &
	Required<Pick<AlertProps, 'severity'>> & {
		/** the message to show on the alert */
		message: ReactNode;

		/** is the alert currently hidden? */
		hidden?: boolean;
	};

export const CustomAlert = ({
	sx,
	message,
	hidden,
	...alertProps
}: CustomAlertProps) => {
	return (
		<Alert
			className={!hidden ? 'showing' : undefined}
			sx={csx(
				{
					display: 'flex',
					gap: 1,
					padding: 1,
					alignItems: 'center',
					borderWidth: 1,
					borderColor: 'currentColor',
					borderStyle: 'solid',
					textTransform: 'capitalize',
					fontWeight: 'medium',
					overflow: 'hidden',
					backgroundColor: (theme) =>
						alpha(theme.palette[alertProps.severity].main, 0.1),
					transition: (theme) =>
						theme.transitions.create([
							'flex-basis',
							'padding',
							'margin',
							'border',
						]),
					'& > .MuiAlert-icon, & > .MuiAlert-action': {
						width: 'auto',
						height: 'fit-content',
						padding: 0,
						margin: 0,
					},
					'& > .MuiAlert-message': {
						alignItems: 'center',
						flex: 1,
						textAlign: 'left',
						padding: 0,
						lineHeight: 1.4,
						...wrappedTextStyle,
					},
				},
				sx,
				hidden && {
					flexBasis: 0,
					padding: 0,
					margin: 0,
					borderWidth: 0,
				},
			)}
			{...alertProps}
		>
			{message}
		</Alert>
	);
};
