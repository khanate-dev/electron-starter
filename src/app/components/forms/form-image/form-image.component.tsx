import { useState } from 'react';
import { Stack } from '@mui/material';

import { IMAGE_EXTENSIONS } from '~/app/config';
import { assertValidImage } from '~/app/helpers/image';
import { CustomAvatar } from '~/app/components/media/custom-avatar';
import { FileUploadButton } from '~/app/components/controls/file-upload-button';

export type FormImageProps = {
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
};

export const FormImage = ({
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
			sx={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
				gap: 2,
			}}
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
