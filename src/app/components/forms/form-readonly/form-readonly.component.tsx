import { Box, Stack, alpha } from '@mui/material';

import { csx, getOppositeColor } from '~/app/helpers/style';
import { CustomTooltip } from '~/app/components/feedback/custom-tooltip';

import type { TextFieldProps } from '@mui/material';

export type FormReadonlyProps = {
	/** the styles to pass to the underlying form component */
	sx?: Mui.SxProp;

	/** the size of the form field */
	size: TextFieldProps['size'];

	/** the label to show for the field */
	label?: string;

	/** the value of the form field? */
	value: unknown;

	/** should the field show tooltip on hover?  */
	hasTooltip?: boolean;
};

export const FormReadonly = ({
	sx,
	size,
	label,
	value,
	hasTooltip,
}: FormReadonlyProps) => {
	const string =
		typeof value === 'number' && !isNaN(value)
			? value.toFixed(2)
			: String(value ?? '');

	if (!label && !string) return null;

	const field = (
		<Stack
			sx={csx(
				{
					width: 1,
					minWidth: 50,
					height: '100%',
					margin: 0,
					textTransform: 'capitalize',
					flexGrow: 1,
					flexShrink: 1,
					flexDirection: 'row',
					flexWrap: 'nowrap',
					overflow: 'hidden',
					gap: size === 'small' ? 0.25 : 0.5,
					borderWidth: 2,
					borderStyle: 'solid',
					borderColor: getOppositeColor,
					fontSize: '0.9em',
					backgroundColor: (theme) => alpha(theme.palette.primary.light, 0.2),
					borderRadius: 1,
					padding: size === 'small' ? 0.25 : 0.5,
					fontWeight: 'medium',
					'& > div': {
						overflow: 'hidden',
						whiteSpace: 'nowrap',
						display: 'flex',
						textOverflow: 'ellipsis',
						alignItems: 'center',
						padding: 1,
						borderRadius: 0.5,
					},
					'& > div:empty': {
						display: 'none',
						padding: 0,
					},
				},
				sx
			)}
		>
			{Boolean(label) && (
				<Box
					sx={{
						minWidth: 0.3,
						flexShrink: 0,
						backgroundColor: getOppositeColor,
						color: 'primary.contrastText',
						justifyContent: 'center',
					}}
				>
					{label}
				</Box>
			)}
			<Box sx={{ flex: 1 }}>{string}</Box>
		</Stack>
	);

	if (!hasTooltip) return field;

	return <CustomTooltip title={string}>{field}</CustomTooltip>;
};
