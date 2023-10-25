import { Box, Stack } from '@mui/material';
import { useReducer, useState } from 'react';

import { FormField } from './form-field.component';
import { FormImage } from './form-image.component';

import { CustomButton } from '../controls/custom-button.component';
import { getImageUrl } from '../../helpers/image.helpers';
import { csx } from '../../helpers/style.helpers';
import { useStatus } from '../../hooks/status.hook';

import type { TextFieldProps } from '@mui/material';
import type { ReactNode, Reducer } from 'react';
import type { Utils } from '../../../shared/types/utils.types';
import type {
	FormSchema,
	FormSelectLists,
	FormSuggestLists,
	FormWorkingObj,
} from '../../classes/form-schema.class';
import type { StatusUpdate } from '../../hooks/status.hook';
import type { App } from '../../types/app.types';
import type { Mui } from '../../types/mui.types';

export type SchemaFormSubmitData<
	T extends FormSchema,
	Picture extends 'required' | 'optional',
> = Utils.prettify<
	T['zod']['_output'] &
		('required' | 'optional' extends Picture
			? {}
			: Picture extends 'required'
			? { picture: File }
			: { picture?: File })
>;

type AgnosticSchemaFormProps<
	T extends FormSchema,
	Picture extends 'required' | 'optional',
> = Mui.propsWithSx<{
	/** the styles to apply to the components */
	styles?: {
		picture?: Mui.sxProp;
		fieldOuterContainer?: Mui.sxProp;
		fieldContainer?: Mui.sxProp;
		field?: Mui.sxProp;
		status?: Mui.sxProp;
		buttonContainer?: Mui.sxProp;
		button?: Mui.sxProp;
	};

	/** the schema to use */
	schema: T;

	/** the id to use for the form element */
	formId?: string;

	/** the size of the fields */
	fieldSize?: TextFieldProps['size'];

	/** the label to show on the submit button */
	submitLabel?: ReactNode;

	/** the callback function for form's cancel button. if excluded, a cancel button will not be rendered */
	onCancel?: () => void;

	/** the callback for form submission. returning a string from the promise will show it as a success message. */
	onSubmit: (
		data: SchemaFormSubmitData<T, Picture>,
	) => Promise<void | string | StatusUpdate>;

	/** is the current form for update? */
	isUpdate: boolean;

	/** is the page calling the form busy? */
	isBusy?: boolean;

	/** should the form be disabled? */
	disabled?: boolean;
}>;

export type AddSchemaFormProps<
	T extends FormSchema,
	Picture extends 'required' | 'optional',
> = AgnosticSchemaFormProps<T, Picture> & {
	/** is the current form for update? */
	isUpdate: false;

	/** the default values for the schema elements */
	defaultValues?: Partial<T['zod']['_output']>;

	/** the details of the profile picture */
	picture?: Picture;

	defaultPicture?: never;
} & FormSelectLists<T> &
	FormSuggestLists<T>;

export type UpdateSchemaFormProps<
	T extends FormSchema,
	Picture extends 'required' | 'optional',
> = AgnosticSchemaFormProps<T, Picture> & {
	/** is the current form for update? */
	isUpdate: true;

	/** the default values for the schema elements */
	defaultValues: T['zod']['_output'];

	/** the details of the profile picture */
	picture?: {
		/** the name of the existing image file? */
		id: App.dbId;

		/** the timestamp of last image update */
		version: number | null;

		/** is the picture required */
		required: Picture;
	};
} & FormSelectLists<T> &
	FormSuggestLists<T>;

export type SchemaFormProps<
	T extends FormSchema,
	Picture extends 'required' | 'optional',
> = AddSchemaFormProps<T, Picture> | UpdateSchemaFormProps<T, Picture>;

type FormAction<WorkingObj extends Obj> =
	| { type: 'reset' }
	| {
			type: 'update';
			key: keyof WorkingObj;
			value: WorkingObj[keyof WorkingObj];
	  };

export const SchemaForm = <
	T extends FormSchema,
	Picture extends 'required' | 'optional',
>({
	schema,
	sx,
	styles,
	formId,
	defaultValues,
	selectionLists,
	suggestionLists,
	picture,
	submitLabel,
	fieldSize,
	onCancel,
	onSubmit,
	isUpdate,
	isBusy: passedIsBusy,
	disabled: passedDisabled,
}: SchemaFormProps<T, Picture>) => {
	const {
		isBusy: isFormBusy,
		statusJsx,
		updateStatus,
		asyncWrapper,
	} = useStatus({ sx: csx({ maxWidth: 750, marginTop: 2 }, styles?.status) });

	const [form, dispatch] = useReducer<
		Reducer<FormWorkingObj<T>, FormAction<FormWorkingObj<T>>>
	>(
		(state, action) => {
			if (action.type === 'reset') return schema.defaultValues as never;
			const { key: field, value } = action;
			return { ...state, [field]: value };
		},
		schema.defaultZod.parse(defaultValues ?? {}) as FormWorkingObj<T>,
	);
	const [image, setImage] = useState<null | File>(null);

	const isBusy = isFormBusy || passedIsBusy;
	const disabled = isBusy || passedDisabled;

	const pictureRequired =
		typeof picture === 'string'
			? picture === 'required'
			: picture?.required === 'required';

	return (
		<Stack
			sx={csx({ flexGrow: 1, alignItems: 'center', width: '100%' }, sx)}
			component='form'
			id={formId}
			onSubmit={(event) => {
				asyncWrapper('submit', async () => {
					event.preventDefault();

					const parsed = schema.zod.parse(form);
					const submitData: typeof parsed & { picture?: File } = { ...parsed };

					if (image !== null) submitData.picture = image;
					else if (pictureRequired) throw new Error('image required!');

					const message = await onSubmit(submitData as never);
					if (!message) return;
					dispatch({ type: 'reset' });
					setImage(null);
					return message;
				});
			}}
		>
			{picture && (
				<FormImage
					sx={styles?.picture}
					disabled={disabled}
					required={picture === 'required'}
					defaultPreview={
						isUpdate
							? getImageUrl({ ...picture, table: schema.name })
							: undefined
					}
					onChange={setImage}
					onError={(message) => {
						updateStatus({ type: 'error', message });
					}}
				/>
			)}

			<Box
				sx={csx(
					{
						display: 'flex',
						justifyContent: 'center',
						width: '100%',
						maxWidth: 900,
						marginInline: 'auto',
						marginBlock: 3,
					},
					styles?.fieldOuterContainer,
				)}
			>
				<Box
					sx={csx(
						{
							flexGrow: 1,
							display: 'grid',
							justifyContent: 'center',
							gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
							gap: 3,
						},
						styles?.fieldContainer,
					)}
				>
					{schema.fieldsArray.map((field) => (
						<FormField
							key={field.name.toString()}
							sx={styles?.field}
							formValues={form}
							size={fieldSize}
							disabled={disabled}
							field={
								{
									...field,
									type: isUpdate && field.noUpdate ? 'readonly' : field.type,
								} as never
							}
							options={
								(selectionLists?.[
									field.name as unknown as keyof typeof selectionLists
								] ??
									suggestionLists?.[
										field.name as unknown as keyof typeof suggestionLists
									] ??
									[]) as never
							}
							onChange={(value) => {
								dispatch({
									type: 'update',
									key: field.name,
									value: value as never,
								});
							}}
						/>
					))}
				</Box>
			</Box>

			{statusJsx}

			<Stack
				direction='row'
				sx={csx(
					{ justifyContent: 'center', marginTop: 2, gap: 2 },
					styles?.buttonContainer,
				)}
			>
				{onCancel && (
					<CustomButton
						sx={styles?.button}
						label='Close'
						variant='outlined'
						size='large'
						disabled={disabled}
						onClick={onCancel}
					/>
				)}
				<CustomButton
					sx={styles?.button}
					label={submitLabel ?? 'Submit'}
					type='submit'
					size='large'
					disabled={disabled}
					isBusy={isBusy}
				/>
			</Stack>
		</Stack>
	);
};
