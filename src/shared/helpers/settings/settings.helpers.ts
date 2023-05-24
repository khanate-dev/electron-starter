import { z } from 'zod';

import { loggedInUserZodSchema } from 'schemas/user';

export const schemas = {
	user: loggedInUserZodSchema,
	isDarkMode: z.boolean(),
};

type Keys = keyof typeof schemas;
type Setting<Key extends Keys> = z.infer<(typeof schemas)[Key]>;

export const removeSetting = (key: Keys): void => {
	localStorage.removeItem(key);
};

export const getSetting = <Key extends Keys>(key: Key): null | Setting<Key> => {
	try {
		const string = localStorage.getItem(key);
		if (!string) return null;

		return schemas[key].parse(JSON.parse(string));
	} catch {
		removeSetting(key);
		return null;
	}
};

export const setSetting = <Key extends Keys>(
	key: Key,
	value: Setting<Key>
): void => {
	localStorage.setItem(key, JSON.stringify(value));
};
