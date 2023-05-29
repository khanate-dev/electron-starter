import { Button, Box } from '@mui/material';
import { DescriptionOutlined as UploadIcon } from '@mui/icons-material';

import { getLoadingStyles } from '~/app/helpers/style';
import { excludeString } from '~/shared/helpers/type';

import type { InputHTMLAttributes, ChangeEventHandler } from 'react';
import type { ButtonProps } from '@mui/material';

export type FileUploadButtonProps = {
	/** The props to pass to pass to the file input element */
	inputProps?: Omit<
		InputHTMLAttributes<HTMLInputElement>,
		'onChange' | 'accept' | 'required'
	>;

	/** the callback function to fire on file input change */
	onChange: ChangeEventHandler<HTMLInputElement>;

	/** the name to give the input element */
	name: string;

	/** the file types accepted by the file input */
	accept?: InputHTMLAttributes<HTMLInputElement>['accept'];

	/** is the file input element required in the form? */
	required?: boolean;

	/** should the button show a loading spinner? */
	isBusy?: boolean;
} & Omit<ButtonProps<'label'>, 'onChange'>;

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
									'primary'
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
