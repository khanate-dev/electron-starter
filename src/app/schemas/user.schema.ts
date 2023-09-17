import { z } from 'zod';

import { FormSchema } from '~/app/classes/form-schema.class';
import { USER_TYPES } from '~/app/constants';
import {
	dbIdSchema,
	imageVersionSchema,
	jwtSchema,
	metaSchema,
} from '~/shared/helpers/schema.helpers';

export type UserType = (typeof USER_TYPES)[number];

export const userTypeDropdownOptions = USER_TYPES.map((row) => ({
	value: row,
	label: row,
}));

export const userSansMetaSchema = z.strictObject({
	UserName: z.string().min(2).max(64),
	Password: z.string().min(2).max(1024),
	UserType: z.enum(USER_TYPES),
	ImageVersion: imageVersionSchema,
});

export const userSchema = userSansMetaSchema.extend({
	UserID: dbIdSchema,
	CreatedAt: metaSchema.shape.CreatedAt,
	UpdatedAt: metaSchema.shape.UpdatedAt,
});

export type UserSansMeta = (typeof userSansMetaSchema)['_output'];

export type User = (typeof userSchema)['_output'];

export const detailedUserSchema = userSchema.omit({ Password: true });

export type DetailedUser = (typeof detailedUserSchema)['_output'];

export const loggedInUserSchema = detailedUserSchema.extend({
	token: jwtSchema,
	refreshToken: jwtSchema,
});

export type LoggedInUser = (typeof loggedInUserSchema)['_output'];

export const userFormZod = userSansMetaSchema.omit({
	ImageVersion: true,
});
export type UserForm = (typeof userFormZod)['_output'];

export const userFormSchema = new FormSchema({
	name: 'user',
	zod: userFormZod,
	fields: {
		UserName: {
			type: 'string',
			noUpdate: true,
			inputProps: {
				pattern: '.*\\S.*',
				title: 'Can not be empty',
			},
		},
		Password: { type: 'string', isSecret: true },
		UserType: { type: 'selection' },
	},
});

export const userResetSchema = z.strictObject({
	oldPassword: userSchema.shape.Password,
	newPassword: userSchema.shape.Password,
	confirmPassword: userSchema.shape.Password,
});

export type UserReset = (typeof userResetSchema)['_output'];

export const loginSchema = userSchema.pick({ UserName: true, Password: true });

export type LoginForm = (typeof loginSchema)['_output'];
