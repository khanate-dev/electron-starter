import { Alert, alpha } from '@mui/material';

import { csx } from '~/app/helpers/style';

import type { AlertProps } from '@mui/material';

export type CustomAlertProps = {
	/** the message to show on the alert */
	message: React.Node;

	/** is the alert currently hidden? */
	hidden?: boolean;
} & Omit<AlertProps, 'children' | 'severity'> &
	Required<Pick<AlertProps, 'severity'>>;

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
					fontSize: '0.8em',
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
						flexGrow: 1,
						flexShrink: 1,
						textAlign: 'left',
						padding: 0,
						lineHeight: 1.4,
						overflow: 'hidden',
						whiteSpace: 'nowrap',
						textOverflow: 'ellipsis',
					},
				},
				sx,
				hidden && {
					flexBasis: 0,
					padding: 0,
					margin: 0,
					borderWidth: 0,
				}
			)}
			{...alertProps}
		>
			{message}
		</Alert>
	);
};
