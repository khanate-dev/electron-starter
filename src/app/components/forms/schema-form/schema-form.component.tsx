import { useState, useReducer } from 'react';
import { Box, Stack } from '@mui/material';
import { isDayjs } from 'dayjs';

import { useStatus } from '~/app/hooks/status';
import { csx } from '~/app/helpers/style';
import { getImageUrl } from '~/app/helpers/image';
import { FormField } from '~/app/components/forms/form-field';
import { FormImage } from '~/app/components/forms/form-image';
import { CustomButton } from '~/app/components/controls/custom-button';

import { formPageStyles as styles } from './schema-form.styles';

import type { FormEventHandler } from 'react';
import type { Dayjs } from 'dayjs';
import type { z } from 'zod';
import type { FieldAction } from '~/app/components/app/field-actions';
import type {
	BaseSelectionType,
	FormFieldZodType,
	FormSchema,
	FormSchemaField,
	FormSchemaLists,
} from '~/app/schemas';
import type { TextFieldProps } from '@mui/material';

type AgnosticSchemaFormProps<
	Zod extends z.ZodObject<Record<string, FormFieldZodType>, 'strict'>,
	Keys extends keyof Zod['shape'],
	WorkingObj extends {
		[K in Keys]: Zod['shape'][K] extends
			| BaseSelectionType
			| z.ZodNullable<BaseSelectionType>
			? z.infer<Zod['shape'][K]> | null
			: Zod['shape'][K] extends z.ZodNumber
			? string
			: z.infer<Zod['shape'][K]>;
	},
	Fields extends {
		[K in Keys]: FormSchemaField<Zod['shape'][K], WorkingObj>;
	}
> = {
	/** the schema to use */
	schema: FormSchema<Zod, Keys, WorkingObj, Fields>;

	/** the styles to apply to the form container */
	sx?: Mui.SxProp;

	/** the id to use for the form element */
	formId?: string;

	/** the size of the fields */
	fieldSize?: TextFieldProps['size'];

	/** the label to show on the submit button */
	submitLabel?: React.Node;

	/** the actions to show on form fields */
	actions?: Partial<Record<Keys, FieldAction[]>>;

	/** the callback function for form's cancel button. if excluded, a cancel button will not be rendered */
	onCancel?: () => void;

	/** the callback for form submission. returning a string from the promise will show it as a success message. */
	onSubmit: (formData: FormData) => Promise<void | string>;

	/** is the current form for updation? */
	isUpdate: boolean;

	/** is the page calling the form busy? */
	isBusy?: boolean;

	/** should the form be disabled? */
	disabled?: boolean;
};

export type AddSchemaFormProps<
	Zod extends z.ZodObject<Record<string, FormFieldZodType>, 'strict'>,
	Keys extends keyof Zod['shape'],
	WorkingObj extends {
		[K in Keys]: Zod['shape'][K] extends
			| BaseSelectionType
			| z.ZodNullable<BaseSelectionType>
			? z.infer<Zod['shape'][K]> | null
			: Zod['shape'][K] extends z.ZodNumber
			? string
			: z.infer<Zod['shape'][K]>;
	},
	Fields extends {
		[K in Keys]: FormSchemaField<Zod['shape'][K], WorkingObj>;
	}
> = AgnosticSchemaFormProps<Zod, Keys, WorkingObj, Fields> & {
	/** is the current form for updation? */
	isUpdate: false;

	/** the default values for the schema elements */
	defaultValues?: Partial<z.infer<Zod>>;

	/** the details of the profile picture */
	picture?: 'optional' | 'required';
} & FormSchemaLists<Zod, Keys, WorkingObj, Fields>;

export type UpdateSchemaFormProps<
	Zod extends z.ZodObject<Record<string, FormFieldZodType>, 'strict'>,
	Keys extends keyof Zod['shape'],
	WorkingObj extends {
		[K in Keys]: Zod['shape'][K] extends
			| BaseSelectionType
			| z.ZodNullable<BaseSelectionType>
			? z.infer<Zod['shape'][K]> | null
			: Zod['shape'][K] extends z.ZodNumber
			? string
			: z.infer<Zod['shape'][K]>;
	},
	Fields extends {
		[K in Keys]: FormSchemaField<Zod['shape'][K], WorkingObj>;
	}
> = AgnosticSchemaFormProps<Zod, Keys, WorkingObj, Fields> & {
	/** is the current form for updation? */
	isUpdate: true;

	/** the default values for the schema elements */
	defaultValues: z.infer<Zod>;

	/** the details of the profile picture */
	picture?: {
		/** the name of the existing image file? */
		identifier: string;

		/** the timestamp of last image update */
		updatedAt: Dayjs | null;

		/** is the profile picture required? */
		required?: boolean;
	};
} & FormSchemaLists<Zod, Keys, WorkingObj, Fields>;

export type SchemaFormProps<
	Zod extends z.ZodObject<Record<string, FormFieldZodType>, 'strict'>,
	Keys extends keyof Zod['shape'],
	WorkingObj extends {
		[K in Keys]: Zod['shape'][K] extends
			| BaseSelectionType
			| z.ZodNullable<BaseSelectionType>
			? z.infer<Zod['shape'][K]> | null
			: Zod['shape'][K] extends z.ZodNumber
			? string
			: z.infer<Zod['shape'][K]>;
	},
	Fields extends {
		[K in Keys]: FormSchemaField<Zod['shape'][K], WorkingObj>;
	}
> =
	| UpdateSchemaFormProps<Zod, Keys, WorkingObj, Fields>
	| AddSchemaFormProps<Zod, Keys, WorkingObj, Fields>;

type FormAction<WorkingObj extends Obj> =
	| { type: 'reset' }
	| {
			type: 'update';
			key: keyof WorkingObj;
			value: WorkingObj[keyof WorkingObj];
	  };

export const SchemaForm = <
	Zod extends z.ZodObject<Record<string, FormFieldZodType>, 'strict'>,
	Keys extends keyof Zod['shape'],
	WorkingObj extends {
		[K in Keys]: Zod['shape'][K] extends
			| BaseSelectionType
			| z.ZodNullable<BaseSelectionType>
			? z.infer<Zod['shape'][K]> | null
			: Zod['shape'][K] extends z.ZodNumber
			? string
			: z.infer<Zod['shape'][K]>;
	},
	Fields extends {
		[K in Keys]: FormSchemaField<Zod['shape'][K], WorkingObj>;
	}
>({
	schema,
	sx,
	formId,
	defaultValues,
	lists,
	picture,
	actions,
	submitLabel,
	fieldSize,
	onCancel,
	onSubmit,
	isUpdate,
	isBusy: passedIsBusy,
	disabled: passedDisabled,
}: SchemaFormProps<Zod, Keys, WorkingObj, Fields>) => {
	const {
		isBusy: isFormBusy,
		statusJsx,
		updateStatus,
		asyncWrapper,
	} = useStatus();

	const [form, dispatch] = useReducer(
		(state: WorkingObj, action: FormAction<WorkingObj>): WorkingObj => {
			if (action.type === 'reset') return schema.defaultValues;
			const { key: field, value } = action;
			return { ...state, [field]: value };
		},
		schema.defaultZod.parse(defaultValues ?? {}) as WorkingObj
	);
	const [image, setImage] = useState<null | File>(null);

	const isBusy = isFormBusy || passedIsBusy;
	const disabled = isBusy || passedDisabled;

	const fields = isUpdate
		? schema.fieldsArray.filter((row) => !row.noUpdate)
		: schema.fieldsArray;

	const pictureRequired =
		typeof picture === 'string' ? picture === 'required' : picture?.required;

	const handleSubmit: FormEventHandler<HTMLFormElement> = asyncWrapper(
		'submit',
		async (event) => {
			event.preventDefault();

			const formData = new FormData();

			for (const field of fields) {
				const value = field.zod.parse(form[field.name]) as string;
				formData.append(
					field.name.toString(),
					isDayjs(value) ? value.toISOString() : value
				);
			}

			if (image !== null) formData.append('picture', image);
			else if (pictureRequired) throw new Error('image required!');

			const message = await onSubmit(formData);
			if (!message) return;
			dispatch({ type: 'reset' });
			setImage(null);
			return message;
		}
	);

	return (
		<Box
			sx={csx(styles.form, sx)}
			component='form'
			id={formId}
			onSubmit={handleSubmit}
		>
			{picture && (
				<FormImage
					disabled={disabled}
					required={pictureRequired}
					defaultPreview={
						isUpdate
							? getImageUrl(schema.name, picture.identifier, picture.updatedAt)
							: undefined
					}
					onChange={setImage}
					onError={(message) => updateStatus({ type: 'error', message })}
				/>
			)}

			<Box sx={styles.fieldContainer}>
				<Box sx={styles.fields}>
					{fields.map((field) => (
						<FormField
							key={field.name.toString()}
							field={field as never}
							formValues={form}
							size={fieldSize}
							disabled={disabled}
							actions={actions?.[field.name]}
							options={(lists?.[field.name] ?? []) as never}
							onChange={(value) =>
								dispatch({
									type: 'update',
									key: field.name,
									value: value as WorkingObj[keyof WorkingObj],
								})
							}
						/>
					))}
				</Box>
			</Box>

			{statusJsx}

			<Stack
				direction='row'
				sx={styles.actions}
			>
				{onCancel && (
					<CustomButton
						label='Cancel'
						variant='outlined'
						disabled={disabled}
						onClick={onCancel}
					/>
				)}
				<CustomButton
					label={submitLabel ?? 'Submit'}
					type='submit'
					disabled={disabled}
					isBusy={isBusy}
				/>
			</Stack>
		</Box>
	);
};
