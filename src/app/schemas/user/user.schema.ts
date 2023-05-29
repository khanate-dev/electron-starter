import { z } from 'zod';

import {
	createZodDbSchema,
	dbIdSchema,
	imageUpdatedAtSchema,
} from '~/shared/helpers/schema';
import { FormSchema, ViewSchema } from '~/app/schemas';
import { USER_TYPES } from '~/app/config';

export type UserType = (typeof USER_TYPES)[number];

export const userTypeDropdownOptions = USER_TYPES.map((row) => ({
	value: row,
	label: row,
}));

export const [userSansMetaZodSchema, userZodSchema] = createZodDbSchema(
	{
		userID: dbIdSchema,
		userName: z.string().min(2).max(64),
		password: z.string().min(2).max(1024),
		userType: z.enum(USER_TYPES),
		imageUpdatedAt: imageUpdatedAtSchema,
	},
	'userID'
);

export type UserSansMeta = z.infer<typeof userSansMetaZodSchema>;

export type User = z.infer<typeof userZodSchema>;

export const userSansPasswordZodSchema = userZodSchema.omit({
	password: true,
});

export type UserSansPassword = z.infer<typeof userSansPasswordZodSchema>;

export const getUserLabel = (val: User) => val.userName;

export const getUserDropdownOptions = (
	list: User[]
): App.DropdownOption<App.DbId>[] => {
	return list.map((row) => ({
		value: row.userID,
		label: getUserLabel(row),
	}));
};

export const loggedInUserZodSchema = userZodSchema
	.omit({ password: true })
	.extend({ token: z.string().uuid() });

export type LoggedInUser = z.infer<typeof loggedInUserZodSchema>;

export const userViewSchema = new ViewSchema({
	name: 'user',
	zod: userSansPasswordZodSchema,
	primaryKey: 'userID',
	identifier: 'userName',
	image: true,
	fields: {
		userName: { type: 'string' },
		userType: { type: 'string' },
	},
});

export const userFormSchema = new FormSchema({
	name: 'user',
	zod: userSansMetaZodSchema
		.extend({ confirmPassword: userZodSchema.shape.password })
		.omit({ imageUpdatedAt: true }),
	fields: {
		userName: {
			type: 'string',
			noUpdate: true,
			inputProps: {
				pattern: '.*\\S.*',
				title: 'Can not be empty',
			},
		},
		password: { type: 'string', isSecret: true },
		confirmPassword: { type: 'string', isSecret: true },
		userType: { type: 'selection' },
	},
});
