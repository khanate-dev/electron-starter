import { DescriptionOutlined as UploadIcon } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

import { getLoadingStyles } from '../../helpers/style.helpers';
import { excludeString } from '../../helpers/type.helpers';

import type { ButtonProps } from '@mui/material';
import type { ComponentPropsWithoutRef } from 'react';

export type FileUploadButtonProps = Omit<ButtonProps<'label'>, 'onChange'> &
	Pick<ComponentPropsWithoutRef<'input'>, 'accept' | 'required'> & {
		/** The props to pass to pass to the file input element */
		inputProps?: Omit<
			ComponentPropsWithoutRef<'input'>,
			'onChange' | 'accept' | 'required'
		>;

		/** the callback function to fire on file input change */
		onChange: Exclude<ComponentPropsWithoutRef<'input'>['onChange'], undefined>;

		/** the name to give the input element */
		name: string;

		/** should the button show a loading spinner? */
		isBusy?: boolean;
	};

export const FileUploadButton = ({
	inputProps,
	onChange,
	name,
	accept,
	required,
	isBusy,
	disabled,
	...buttonProps
}: FileUploadButtonProps) => {
	return (
		<Box
			component='label'
			sx={{
				display: 'flex',
				'& > input': { display: 'none' },
			}}
		>
			<input
				{...inputProps}
				name={name}
				type='file'
				disabled={isBusy ?? disabled}
				accept={accept}
				required={required}
				onChange={onChange}
			/>
			<Button
				{...buttonProps}
				variant={buttonProps.variant ?? 'contained'}
				startIcon={buttonProps.startIcon ?? <UploadIcon />}
				color={buttonProps.color ?? 'primary'}
				component='span'
				disabled={isBusy || disabled}
				sx={
					isBusy
						? getLoadingStyles(
								excludeString(buttonProps.color, ['inherit', 'default']) ??
									'primary',
						  )
						: undefined
				}
				disableElevation
			>
				Select File{required && ' *'}
			</Button>
		</Box>
	);
};
