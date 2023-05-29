import { Stack } from '@mui/material';
import {
	FlashOn as ActionIcon,
	Visibility as ViewIcon,
	Add as AddIcon,
	Edit as UpdateIcon,
	Delete as DeleteIcon,
} from '@mui/icons-material';

import { CustomButton } from '~/app/components/controls/custom-button';
import { csx } from '~/app/helpers/style';

const icons = {
	add: <AddIcon />,
	update: <UpdateIcon />,
	delete: <DeleteIcon />,
	view: <ViewIcon />,
};

export type FieldAction = {
	/** the label to show on the action's button */
	label?: string;

	/** the icon to show on the action's button */
	icon?: keyof typeof icons | JSX.Element;

	/** the callback function when the action is clicked */
	onClick: () => void;
};

export type FieldActionsProps = {
	/** the styles to apply to the container */
	sx?: Mui.SxProp;

	/** the list of actions to render */
	actions: FieldAction[];

	/** should the actions be disabled? */
	disabled?: boolean;

	/** should the actions use a full button instead of icon buttons? */
	fullButtons?: boolean;
};

export const FieldActions = ({
	sx,
	actions,
	disabled,
	fullButtons,
}: FieldActionsProps) => {
	return (
		<Stack
			direction='row'
			sx={csx({ flex: 0, width: 1, gap: 1 }, sx)}
		>
			{actions.map((action, index) => (
				<CustomButton
					key={index}
					label={action.label}
					disabled={disabled}
					isIcon={!fullButtons}
					icon={
						typeof action.icon === 'string'
							? icons[action.icon]
							: action.icon ?? <ActionIcon />
					}
					sx={{
						padding: 0.5,
						borderRadius: 1,
						'& svg': { width: 25, height: 'auto' },
					}}
					onClick={action.onClick}
				/>
			))}
		</Stack>
	);
};
