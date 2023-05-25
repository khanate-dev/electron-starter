import { Typography, Box } from '@mui/material';

import { useStatus } from '~/app/hooks/status';
import { GeneralDialog } from '~/app/components/dialogs/general-dialog';

import { deleteDialogStyles as styles } from './delete-dialog.styles';

export type DeleteDialogProps = {
	/** the label of the target table's name */
	target: string;

	/** the id of the entry to be deleted? */
	id: number;

	/** the label to show for the entry to be deleted */
	label?: string;

	/** the function to call on cancellation */
	onCancel: () => void;

	/** the function to call to delete the entry */
	onDelete: () => Promise<any>;
};

export const DeleteDialog = ({
	target,
	id,
	label,
	onCancel,
	onDelete,
}: DeleteDialogProps) => {
	const { isBusy, status, asyncWrapper, statusJsx } = useStatus();

	const identifier = String(label ?? (id ? `ID: ${id}` : 'A Row'));

	return (
		<GeneralDialog
			accent='error'
			title='Delete Confirmation'
			styles={{ content: styles.content }}
			disableActions={isBusy || status.type === 'success'}
			actions={[
				{
					label: 'Delete',
					onClick: asyncWrapper('submit', async () => {
						await onDelete();
						return {
							type: 'success',
							message: 'deletion successful!',
							ephemeral: true,
							duration: 1000,
						};
					}),
					isBusy,
				},
			]}
			hasCloseAction
			onClose={onCancel}
		>
			<Typography>
				You Are Deleting
				<Box
					sx={styles.highlight}
					component='span'
				>
					{identifier}
				</Box>
				From
				<Box
					sx={styles.highlight}
					component='span'
				>
					{target}
				</Box>
			</Typography>

			<Typography>Are You Sure You Want To Continue?</Typography>

			{statusJsx}
		</GeneralDialog>
	);
};
