import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from '@mui/material';
import { Cancel as CancelIcon } from '@mui/icons-material';

import { csx } from '~/app/helpers/style';
import { CustomButton } from '~/app/components/controls/custom-button';

import { getGeneralDialogStyles } from './general-dialog.styles';

import type { DialogProps } from '@mui/material';
import type { FullButtonProps } from '~/app/components/controls/custom-button';

export type GeneralDialogAction = FullButtonProps;

export type GeneralDialogProps = {
	children: React.Node;

	/** the styles to pass to the Dialog container */
	sx?: Mui.SxProp;

	/** the accent color for the dialog. used for default color for header and buttons */
	accent?: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';

	/** the styles to apply to the dialog components */
	styles?: Partial<
		Record<'container' | 'title' | 'content' | 'actions', Mui.SxProp>
	>;

	/** the callback function when the dialog closes */
	onClose: () => void;

	/** the title to show on the dialog header */
	title: React.Node;

	/** the actions to show for the dialog */
	actions?: GeneralDialogAction[];

	/** the open prop to pass to MUI Dialog */
	open?: DialogProps['open'];

	/** the maxWidth to pass to MUI Dialog */
	maxWidth?: DialogProps['maxWidth'];

	/** should clicking the modal's backdrop be ignored? */
	disableBackdropClick?: boolean;

	/** should the dialog actions be disabled? */
	disableActions?: boolean;

	/** should the dialog have a close action button? */
	hasCloseAction?: boolean;
};

export const GeneralDialog = ({
	children,
	sx,
	accent,
	styles: passedStyles,
	onClose,
	title,
	actions: passedActions,
	open,
	maxWidth = 'sm',
	disableBackdropClick,
	disableActions,
	hasCloseAction,
}: GeneralDialogProps) => {
	const styles = getGeneralDialogStyles({ accent });

	const closeAction: GeneralDialogAction = {
		onClick: onClose,
		label: 'Close',
		variant: 'outlined',
	};

	const actions = hasCloseAction
		? [...(passedActions ?? []), closeAction]
		: passedActions;

	return (
		<Dialog
			open={open ?? true}
			maxWidth={maxWidth}
			PaperProps={{
				sx: csx(styles.dialogContainer, sx, passedStyles?.container),
			}}
			fullWidth
			onClose={(_event, reason) => {
				if (reason === 'backdropClick' && disableBackdropClick) return;

				onClose();
			}}
		>
			<DialogTitle sx={csx(styles.title, passedStyles?.title)}>
				<Typography
					sx={styles.titleLabel}
					variant='h4'
					component='span'
				>
					{title}
				</Typography>

				<CustomButton
					sx={styles.titleClose}
					tooltipStyles={styles.titleCloseTooltip}
					label='Close'
					icon={<CancelIcon />}
					isIcon
					onClick={onClose}
				/>
			</DialogTitle>

			<DialogContent
				className='scroll-y'
				sx={csx(styles.content, passedStyles?.content)}
			>
				{children}
			</DialogContent>

			{actions && (
				<DialogActions sx={csx(styles.actions, passedStyles?.actions)}>
					{actions.map(({ color, disabled, ...props }, index) => (
						<CustomButton
							key={index}
							{...props}
							sx={csx(styles.action, props.sx)}
							color={color ?? accent}
							disabled={disableActions ?? disabled}
						/>
					))}
				</DialogActions>
			)}
		</Dialog>
	);
};
