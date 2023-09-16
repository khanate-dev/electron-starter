import type { User } from '~/app/schemas/user.schema';
import type { App } from '~/app/types/app.types';

export const getStringDropdownOptions = (
	list: string[],
): App.dropdownOption<App.stringSelection>[] => {
	return list.map((row) => ({
		value: row as App.stringSelection,
		label: row,
	}));
};

export const getNumberDropdownOptions = (
	list: number[],
): App.dropdownOption<App.numberSelection>[] => {
	return list.map((row) => ({
		value: row as App.numberSelection,
		label: row.toString(),
	}));
};

export const getDbIdDropdownOptions = (
	list: number[],
): App.dropdownOption<App.dbId>[] => {
	return list.map((row) => ({
		value: row as App.dbId,
		label: row.toString(),
	}));
};

type labelObj<T extends string> = { [key in T]: string | null };

export const getUserLabel = (val: labelObj<'UserName'>) => val.UserName ?? '';

export const getUserDropdownOptions = (
	list: User[],
): App.dropdownOption<App.dbId>[] => {
	return list.map((row) => ({
		value: row.UserID,
		label: getUserLabel(row),
	}));
};
