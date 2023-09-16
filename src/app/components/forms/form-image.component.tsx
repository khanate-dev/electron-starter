import { Stack } from '@mui/material';
import { useState } from 'react';

import { FileUploadButton } from '~/app/components/controls/file-upload-button.component';
import { CustomAvatar } from '~/app/components/media/custom-avatar.component';
import { assertValidImage } from '~/app/helpers/image.helpers';
import { csx } from '~/app/helpers/style.helpers';
import { IMAGE_EXTENSIONS } from '~/app/constants';

import type { Mui } from '~/app/types/mui.types';


export type FormImageProps = Mui.propsWithSx<{
	/** the width and height of the image, in pixels */
	size?: number;

	/** the callback function to call when the image changes */
	onChange: (image: File) => void;

	/** the callback function for file errors */
	onError: (error: unknown) => void;

	/** the default image to show on the form. */
	defaultPreview?: string;

	/** should the form element be disabled? */
	disabled?: boolean;

	/** is the form image a required */
	required?: boolean;
}>;

export const FormImage = ({
	sx,
	size,
	defaultPreview,
	onChange,
	onError,
	disabled,
	required,
}: FormImageProps) => {
	const [preview, setPreview] = useState(defaultPreview ?? undefined);

	return (
		<Stack
			sx={csx(
				{
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 2,
				},
				sx,
			)}
		>
			<CustomAvatar
				size={size ?? 75}
				src={preview}
			/>
			<FileUploadButton
				name='image'
				accept={IMAGE_EXTENSIONS.join()}
				required={required}
				disabled={disabled}
				onChange={({ target }) => {
					try {
						const file = target.files?.[0];
						assertValidImage(file);
						const newPreview = URL.createObjectURL(file);
						setPreview(newPreview);
						onChange(file);
					} catch (error) {
						onError(error);
					}
				}}
			/>
		</Stack>
	);
};
