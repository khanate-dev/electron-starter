import { csx } from '~/app/helpers/style';
import { GeneralDialog } from '~/app/components/dialogs/general-dialog';

import type { GeneralDialogProps } from '~/app/components/dialogs/general-dialog';

type ErrorDialogBaseProps = {
	children?: GeneralDialogProps['children'];

	/** the content of the error dialog */
	content?: GeneralDialogProps['children'];

	/** extra actions to show on the dialog */
	actions?: GeneralDialogProps['actions'];
} & Pick<GeneralDialogProps, 'onClose' | 'title' | 'maxWidth' | 'styles'>;

type ErrorDialogWithChildrenProps = {
	children: GeneralDialogProps['children'];

	/** the content of the error dialog */
	content?: undefined;
} & ErrorDialogBaseProps;

type ErrorDialogWithContentProps = {
	children?: undefined;

	/** the content of the error dialog */
	content: GeneralDialogProps['children'];
} & ErrorDialogBaseProps;

export type ErrorDialogProps =
	| ErrorDialogWithChildrenProps
	| ErrorDialogWithContentProps;

export const ErrorDialog = ({
	styles: passedStyles,
	onClose,
	title = 'Error',
	content,
	children,
	actions,
	maxWidth,
}: ErrorDialogProps) => (
	<GeneralDialog
		accent='error'
		title={title}
		maxWidth={maxWidth}
		actions={actions}
		styles={{
			content: csx(
				{
					fontSize: '1.5em',
					textAlign: 'center',
					'& > p': {
						fontSize: 'inherit',
					},
				},
				passedStyles?.content
			),
			...passedStyles,
		}}
		hasCloseAction
		onClose={onClose}
	>
		{children ?? content}
	</GeneralDialog>
);
