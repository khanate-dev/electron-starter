import type { z } from 'zod';
import type {
	ChangeEventHandler,
	Dispatch,
	FormEventHandler,
	ReactNode as RNode,
	SetStateAction,
} from 'react';
import type { LoaderFunction, ActionFunction } from 'react-router-dom';
import type { SxProps, Theme } from '@mui/material';
import type { SystemStyleObject } from '@mui/system';
import type { ENVIRONMENTS } from '~/app/config';
import type {
	NumberSelection,
	StringSelection,
	dbIdSchema,
} from '~/shared/helpers/schema';
import type { _localIdSchema } from '~/shared/helpers/data';

type DropFirst<T extends readonly unknown[]> = T extends readonly [
	any?,
	...infer U
]
	? U
	: [...T];

type _RepeatedString<
	S extends string,
	T extends unknown[]
> = T['length'] extends 1 ? S : `${S}${_RepeatedString<S, DropFirst<T>>}`;

type _RepeatedTuple<
	T,
	N extends number,
	R extends unknown[]
> = R['length'] extends N ? R : _RepeatedTuple<T, N, [T, ...R]>;

export declare global {
	// #region Utils

	/** global type helper to repeat a type `N` times in a tuple */
	type RepeatedTuple<T, N extends number> = N extends N
		? number extends N
			? T[]
			: _RepeatedTuple<T, N, []>
		: never;

	/** global type helper to repeat a string `N` times in a string literal type */
	type RepeatedString<S extends string, N extends number> = _RepeatedString<
		S,
		RepeatedTuple<unknown, N>
	>;

	type FilteredKeys<T, U> = {
		[P in keyof T]: T[P] extends U ? P : never;
	}[keyof T];

	/** global type helper to create a union array type from a union type */
	type DistributedArray<T> = T extends infer I ? I[] : never;

	/** global type alias for a generic object type */
	type Obj = Record<string, unknown>;

	/** global type helper for generic object types containing `_localId`  */
	type WithLocalId<Type extends Obj> = Type & { _localId: _LocalId };

	/** global type helper to be able to use arrow functions for assertions */
	type AssertFunction<Type> = (value: unknown) => asserts value is Type;

	/** global type helper to be able to use arrow functions for array assertions */
	type AssertArrayFunction<Type> = (
		value: unknown,
		onlyCheckFirst?: boolean
	) => asserts value is Type;

	/** global type helper to prettify complex object types */
	type Prettify<T> = {
		[K in keyof T]: T[K];
		// eslint-disable-next-line @typescript-eslint/ban-types
	} & {};

	/** takes a string literal as input and returns the union of all the characters */
	type StringToUnion<T extends string> = T extends `${infer U}${infer V}`
		? U | StringToUnion<V>
		: never;

	// #endregion

	// #region App

	/** global union type of possible app environment */
	type Environment = (typeof ENVIRONMENTS)[number];

	/** global branded type for database ids */
	type DbId = z.infer<typeof dbIdSchema>;

	/** global branded type for `_localId` field in data objects */
	type _LocalId = z.infer<typeof _localIdSchema>;

	/** global union type of app theme color names  */
	type ThemeColor = Extract<
		keyof Theme['palette'],
		| 'primary'
		| 'secondary'
		| 'error'
		| 'success'
		| 'info'
		| 'warning'
		| 'wimetrixPrimary'
		| 'wimetrixSecondary'
	>;

	type DropdownType = StringSelection | NumberSelection | DbId;

	type DropdownOption<Type extends DropdownType> = Prettify<{
		value: Type;
		label: ReactNode;
	}>;

	type DropdownOptionLists<
		Key extends PropertyKey,
		Type extends DropdownType = DropdownType
	> = {
		[x in Key]: DropdownOption<Type>[];
	};

	type OptionalGroup<T extends Record<string, unknown>> =
		| T
		| { [K in keyof T]?: never };

	// #endregion

	// #region React

	/** global type helper for a `setState` function */
	type SetState<Type> = Dispatch<SetStateAction<Type>>;

	/** global type helper for input change event handler */
	type InputChangeHandler = ChangeEventHandler<HTMLInputElement>;

	/** global type helper for a form submission event handler */
	type SubmitHandler = FormEventHandler<HTMLFormElement>;

	/** global type re-export for `ReactNode` type from `react` */
	type ReactNode = RNode;

	/** global type helper for component accepting a `ReactNode` as the `children` prop */
	type ComponentWithChildren = {
		children: ReactNode;
	};

	// #endregion

	// #region React Router

	/** global type re-export for `LoaderFunction` type from `react-router` */
	type Loader = LoaderFunction;

	/** global type re-export for `ActionFunction` type from `react-router` */
	type Action = ActionFunction;

	// #endregion

	// #region MUI

	/** global type helper for the `sx` props on component */
	type SxProp = SxProps<Theme>;

	/** global type helper for valid styles accepted by `sx` props */
	type SxStyle =
		| SystemStyleObject<Theme>
		| ((theme: Theme) => SystemStyleObject<Theme>);

	/** global type helper for valid style objects. use it with `satisfies` */
	type SxStyleObj<T extends string = string> = Record<T, SxStyle>;

	// #endregion
}
