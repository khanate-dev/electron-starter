/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { createStore } from '~/helpers/store.helpers';
import { loggedInUserSchema } from '~/schemas/user.schema';

import type { PropsWithChildren } from 'react';
import type { LoggedInUser } from '~/schemas/user.schema';

const store = createStore({ key: 'user', schema: loggedInUserSchema });

export const userStore = {
	...store,
	update: (toUpdate: Partial<LoggedInUser>) => {
		const user = store.get();
		if (!user) return;
		store.set({ ...user, ...toUpdate });
	},
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
	const user = userStore.get();
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
