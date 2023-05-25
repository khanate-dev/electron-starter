import { z } from 'zod';

import { apiEndpoint } from '~/app/config';
import {
	loggedInUserZodSchema,
	userSansPasswordZodSchema,
} from '~/app/schemas/user';
import {
	deleteRequest,
	getRequest,
	postRequest,
	putRequest,
} from '~/shared/helpers/api';

const prefix = `${apiEndpoint}/user`;

export const getUsers = async () => {
	return getRequest(`${prefix}/getAll`, {
		schema: z.array(userSansPasswordZodSchema),
		shouldSort: true,
	});
};

export const getUserById = async (userId: DbId) => {
	return getRequest(`${prefix}/get/${userId}`, {
		schema: userSansPasswordZodSchema,
	});
};

export const addUser = async (body: FormData) => {
	if (body.get('password') !== body.get('confirmPassword'))
		throw new Error("The two passwords don't match!");

	return postRequest(`${prefix}/insert`, body);
};

export const resetUserPassword = async (userId: DbId, body: FormData) => {
	if (body.get('password') !== body.get('confirmPassword'))
		throw new Error("The two passwords don't match!");

	return postRequest(`${prefix}/reset-password/:${userId}`, body);
};

export const login = async (data: FormData) => {
	const response = await postRequest('signin', data, true);
	return loggedInUserZodSchema.parse(response);
};

export const updateUser = async (userId: DbId, body: FormData) => {
	return putRequest(`${prefix}/update/${userId}`, body);
};

export const deleteUser = async (userId: DbId) => {
	return deleteRequest(`${prefix}/delete/${userId}`);
};
