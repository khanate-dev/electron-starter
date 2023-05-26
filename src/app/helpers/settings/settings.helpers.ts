import { z } from 'zod';

import { loggedInUserZodSchema } from '~/app/schemas/user';

export const schemas = {
	user: loggedInUserZodSchema,
	isDarkMode: z.boolean(),
};

type SettingSchemas = typeof schemas;

export type Settings = {
	[K in keyof SettingSchemas]: z.infer<SettingSchemas[K]>;
};

export const removeSetting = (key: keyof Settings): void => {
	localStorage.removeItem(key);
};

export const getSetting = <Key extends keyof Settings>(
	key: Key
): null | Settings[Key] => {
	try {
		const string = localStorage.getItem(key);
		if (!string) return null;
		return schemas[key].parse(JSON.parse(string)) as never;
	} catch {
		removeSetting(key);
		return null;
	}
};

export const setSetting = <Key extends keyof Settings>(
	key: Key,
	value: Settings[Key]
): void => {
	localStorage.setItem(key, JSON.stringify(value));
};
