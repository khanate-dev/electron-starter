import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { getLocalStorage } from '../helpers/local-storage.helpers';
import { loggedInUserSchema } from '../schemas/user.schema';

import type { PropsWithChildren } from 'react';
import type { LoggedInUser } from '../schemas/user.schema';

export const getLocalStorageUser = () => {
	return getLocalStorage(
		'user',
		z.preprocess((val) => JSON.parse(String(val)), loggedInUserSchema),
	);
};

export const setLocalStorageUser = (user: LoggedInUser) => {
	window.localStorage.setItem('user', JSON.stringify(user));
};

export const updateLocalStorageUser = (toUpdate: Partial<LoggedInUser>) => {
	const user = getLocalStorageUser();
	if (!user) return;
	setLocalStorageUser({ ...user, ...toUpdate });
};

export const logout = () => {
	window.dispatchEvent(new CustomEvent('logout'));
};

export const UserProvider = (props: PropsWithChildren) => {
	const navigate = useNavigate();
	useEffect(() => {
		const listener = () => {
			window.localStorage.removeItem('user');
			navigate('/login');
		};
		window.addEventListener('logout', listener);
		return () => {
			window.removeEventListener('logout', listener);
		};
	}, [navigate]);
	return props.children;
};

export const useUser = () => {
	const user = getLocalStorageUser();
	const ref = useRef<LoggedInUser | null>(user);

	useEffect(() => {
		if (ref.current === null && !user) ref.current = user;
	}, [user]);

	if (!user) {
		if (ref.current !== null) return ref.current;
		throw new Error('useUser must be used in an authorized route');
	}
	return user;
};
