import { z } from 'zod';

import { getRequest, postRequest, putRequest } from '../helpers/api.helpers';
import { objectToFormData } from '../helpers/object.helpers';
import { detailedUserSchema, loggedInUserSchema } from '../schemas/user.schema';

import type { BulkResponse } from '../helpers/api.helpers';
import type { LoginForm, UserForm, UserReset } from '../schemas/user.schema';
import type { App } from '../types/app.types';

const prefix = 'users';

export const getUsers = async () => {
	return getRequest(`${prefix}/findAll`, {
		schema: z.array(detailedUserSchema),
	});
};

export const getUserById = async (userId: App.dbId) => {
	return getRequest(`${prefix}/findOne/${userId}`, {
		schema: detailedUserSchema,
	});
};

export const addUser = async (data: UserForm & { picture?: File }) => {
	return postRequest(`${prefix}/insertOne`, objectToFormData(data));
};

export const addUsers = async (users: UserForm[]) => {
	return postRequest<BulkResponse<UserForm>>(`${prefix}/insertMany`, users);
};

export const updateUser = async (
	id: App.dbId,
	data: Omit<UserForm, 'Password'> & { Password: string | null } & {
		picture?: File;
	},
) => {
	return putRequest(`${prefix}/updateOne/${id}`, objectToFormData(data));
};

export const resetUserPassword = async (id: App.dbId, data: UserReset) => {
	if (data.newPassword !== data.confirmPassword)
		throw new Error("The two passwords don't match!");
	return putRequest(`users/resetPassword/${id}`, data);
};

export const validateUserToken = async () => {
	return getRequest(`${prefix}/validateToken`, {
		schema: z.undefined().optional(),
	});
};

export const login = async (data: LoginForm) => {
	const response = await postRequest(`${prefix}/signin`, data, true);
	return loggedInUserSchema.parse(response);
};
