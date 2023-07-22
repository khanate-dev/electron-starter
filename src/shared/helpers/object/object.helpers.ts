import type { Utils } from '~/shared/types/utils';

export const objectEntries = <Keys extends PropertyKey, Type>(
	object: Record<Keys, Type>,
) => Object.entries(object) as [Keys, Type][];

export const objectKeys = <Keys extends PropertyKey, Values>(
	object: Record<Keys, Values>,
) => Object.keys(object) as Keys[];

export const objectValues = <Keys extends PropertyKey, Values>(
	object: Record<Keys, Values>,
) => Object.values<Values>(object);

export const omit = <
	Type extends Record<string, unknown>,
	Key extends keyof Type,
>(
	object: Type,
	keys: Key | Key[],
): Utils.prettify<Omit<Type, Key>> => {
	const keyArray = Array.isArray(keys) ? keys : [keys];
	return objectEntries<Key, unknown>(object).reduce<Omit<Type, Key>>(
		(obj, [key, value]) => {
			if (keyArray.includes(key)) return obj;
			return { ...obj, [key]: value };
		},
		{} as Omit<Type, Key>,
	);
};

export const pick = <
	Type extends Record<string, unknown>,
	Key extends keyof Type,
>(
	object: Type,
	keys: Key | Key[],
): Utils.prettify<Pick<Type, Key>> => {
	const keyArray = Array.isArray(keys) ? keys : [keys];
	return objectEntries<Key, unknown>(object).reduce<Pick<Type, Key>>(
		(obj, [key, value]) => {
			if (!keyArray.includes(key)) return obj;
			return { ...obj, [key]: value };
		},
		{} as Pick<Type, Key>,
	);
};
