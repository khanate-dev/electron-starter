import { Cancel as CancelIcon } from '@mui/icons-material';
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
	alpha,
} from '@mui/material';

import { CustomButton } from '~/app/components/controls/custom-button.component';
import { csx, scrollStyles } from '~/app/helpers/style.helpers';

import type { DialogProps } from '@mui/material';
import type { ReactNode } from 'react';
import type { FullButtonProps } from '~/app/components/controls/custom-button.component';
import type { Mui } from '~/app/types/mui.types';

export type GeneralDialogAction = FullButtonProps;

export type GeneralDialogProps = Mui.propsWithSx<{
	/** the accent color for the dialog. used for default color for header and buttons. @default `primary` */
	accent?: 'primary' | 'secondary' | 'error' | 'success' | 'info' | 'warning';

	/** the styles to apply to the dialog components */
	styles?: Partial<
		Record<'container' | 'title' | 'content' | 'actions', Mui.sxProp>
	>;

	/** the callback function when the dialog closes */
	onClose: () => void;

	/** the title to show on the dialog header */
	title: ReactNode;

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

	children: ReactNode;
}>;

export const GeneralDialog = ({
	children,
	sx,
	accent = 'primary',
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
				sx: csx(
					{ backgroundColor: 'background.paper', borderRadius: 2 },
					sx,
					passedStyles?.container,
				),
			}}
			fullWidth
			onClose={(_event, reason) => {
				if (reason === 'backdropClick' && disableBackdropClick) return;

				onClose();
			}}
		>
			<DialogTitle
				sx={csx(
					{
						backgroundColor: `${accent}.main`,
						color: `${accent}.contrastText`,
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						padding: 2,
						'& + .MuiDialogContent-root': {
							paddingTop: (theme) => `${theme.spacing(2)} !important`,
						},
					},
					passedStyles?.title,
				)}
			>
				<Typography
					variant='h4'
					component='span'
					sx={{ flex: 1, textTransform: 'capitalize' }}
					noWrap
				>
					{title}
				</Typography>

				<CustomButton
					label='Close'
					icon={<CancelIcon />}
					sx={{
						flexGrow: 0,
						padding: 0,
						'& svg': {
							width: 30,
							height: 30,
							transition: (theme) =>
								theme.transitions.create(['width', 'height']),
						},
						color: `${accent}.contrastText`,
						position: 'relative',
						zIndex: 1,
						'&::before': {
							content: '""',
							borderRadius: '50%',
							backgroundColor: (theme) =>
								alpha(theme.palette.common.black, 0.1),
							position: 'absolute',
							width: 0,
							height: 0,
							zIndex: -1,
							transition: (theme) =>
								theme.transitions.create(['width', 'height']),
						},
						'&:hover': {
							'&::before': {
								width: '175%',
								height: '175%',
							},
						},
					}}
					tooltip={{
						sx: {
							backgroundColor: `${accent}.main`,
							color: `${accent}.contrastText`,
						},
					}}
					isIcon
					onClick={onClose}
				/>
			</DialogTitle>

			<DialogContent
				sx={csx(
					{
						flexGrow: 1,
						margin: 0,
						padding: 2,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-start',
						alignItems: 'center',
						gap: 2,
						minHeight: 100,
						...scrollStyles.y,
					},
					passedStyles?.content,
				)}
			>
				{children}
			</DialogContent>

			{actions && (
				<DialogActions
					sx={csx(
						{
							margin: 0,
							padding: 2,
							justifyContent: 'center',
						},
						passedStyles?.actions,
					)}
				>
					{actions.map(({ color, disabled, ...props }, index) => (
						<CustomButton
							key={index}
							{...props}
							color={color ?? accent}
							disabled={disableActions ?? disabled}
							sx={csx(
								{
									fontSize: '1.3em',
									borderRadius: 3,
									flexGrow: 1,
									flexShrink: 1,
									flexBasis: 1,
									maxWidth: 200,
									padding: '10px 20px',
									lineHeight: 1.2,
								},
								props.sx,
							)}
						/>
					))}
				</DialogActions>
			)}
		</Dialog>
	);
};
