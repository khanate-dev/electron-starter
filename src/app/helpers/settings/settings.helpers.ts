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

export const removeSetting = async (key: keyof Settings): Promise<void> => {
	return window.ipc.settings.remove(key);
};

export const getSetting = async <Key extends keyof Settings>(
	key: Key
): Promise<null | Settings[Key]> => {
	try {
		const string = await window.ipc.settings.get(key);
		if (!string) return null;

		return schemas[key].parse(JSON.parse(string)) as never;
	} catch {
		removeSetting(key);
		return null;
	}
};

export const setSetting = async <Key extends keyof Settings>(
	key: Key,
	value: Settings[Key]
): Promise<void> => {
	return window.ipc.settings.set(key, JSON.stringify(value));
};
