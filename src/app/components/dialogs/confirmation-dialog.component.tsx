import { Typography } from '@mui/material';

import { GeneralDialog } from './general-dialog.component';

import { useStatus } from '../../hooks/status.hook';

import type { ReactNode } from 'react';

export type ConfirmationDialogProps = {
	/** the label to show for the entry to be deleted */
	label?: ReactNode;

	/** the function to call on cancellation */
	onClose: (success?: boolean) => void;

	/** the function to call to perform the action on confirmation */
	confirmAction: () => Promise<unknown>;
};

export const ConfirmationDialog = ({
	label,
	onClose,
	confirmAction,
}: ConfirmationDialogProps) => {
	const { isBusy, status, asyncWrapper, statusJsx } = useStatus();

	return (
		<GeneralDialog
			accent='error'
			title='Confirmation'
			disableActions={isBusy || status.type === 'success'}
			styles={{
				content: {
					gap: '5px',
					justifyContent: 'center',
					fontSize: '1.5em',
					textAlign: 'center',
					'& > p': { fontSize: 'inherit', textTransform: 'capitalize' },
				},
			}}
			actions={[
				{
					label: 'Confirm',
					onClick: () => {
						asyncWrapper('submit', async () => {
							await confirmAction();
							setTimeout(() => {
								onClose(true);
							}, 1250);
							return {
								type: 'success',
								message: 'success!',
								ephemeral: true,
								duration: 1000,
							};
						});
					},
					isBusy,
				},
			]}
			hasCloseAction
			onClose={onClose}
		>
			{Boolean(label) && <Typography>{label}</Typography>}
			<Typography>Please confirm to continue</Typography>
			{statusJsx}
		</GeneralDialog>
	);
};
