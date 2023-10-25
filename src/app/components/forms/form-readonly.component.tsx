import { Box, Stack } from '@mui/material';

import { CustomTooltip } from '../feedback/custom-tooltip.component';
import { csx, wrappedTextStyle } from '../../helpers/style.helpers';

import type { TextFieldProps } from '@mui/material';
import type { Mui } from '../../types/mui.types';

export type FormReadonlyProps = Mui.propsWithSx<{
	/** the size of the form field. @default `medium` */
	size?: TextFieldProps['size'];

	/** the label to show for the field */
	label?: string;

	/** the value of the form field? */
	value: unknown;

	/** should the field show tooltip on hover?  */
	hasTooltip?: boolean;
}>;

export const FormReadonly = ({
	sx,
	size = 'medium',
	label,
	value,
	hasTooltip,
}: FormReadonlyProps) => {
	const string =
		typeof value === 'number' && !isNaN(value) && Math.trunc(value) !== value
			? value.toFixed(2)
			: String(value ?? '');

	if (!label && !string) return null;

	const spacing = 0.5;

	const field = (
		<Stack
			sx={csx(
				{
					width: 1,
					minWidth: 50,
					margin: 0,
					minHeight: size === 'medium' ? 52 : 36,
					textTransform: 'capitalize',
					flexGrow: 1,
					flexShrink: 1,
					flexDirection: 'row',
					flexWrap: 'nowrap',
					overflow: 'hidden',
					gap: spacing * 2,
					color: 'text.secondary',
					backgroundColor: 'background.default',
					borderWidth: 2,
					borderStyle: 'solid',
					borderColor: 'divider',
					borderRadius: 1,
					padding: label ? spacing : spacing * 2,
					fontWeight: 'medium',
					justifyContent: label ? 'flex-start' : 'center',
					alignItems: label ? 'stretch' : 'center',
					'& > div': {
						display: 'flex',
						alignItems: 'center',
						borderRadius: 0.75,
						...wrappedTextStyle,
					},
					'& > div:empty': {
						display: 'none',
						padding: 0,
					},
				},
				sx,
			)}
		>
			{label ? (
				<>
					<Box
						sx={{
							minWidth: 0.3,
							flexShrink: 0,
							borderWidth: 2,
							borderStyle: 'solid',
							borderColor: 'divider',
							backgroundColor: 'background.paper',
							justifyContent: 'center',
							paddingInline: spacing * 2,
						}}
					>
						{label}
					</Box>
					<Box sx={{ flex: 1 }}>{string}</Box>
				</>
			) : (
				string
			)}
		</Stack>
	);

	if (!hasTooltip) return field;

	return <CustomTooltip title={string}>{field}</CustomTooltip>;
};
