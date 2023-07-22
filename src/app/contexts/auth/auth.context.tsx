import { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { events } from '~/app/helpers/events';
import { removeSetting } from '~/app/helpers/settings';

import type { ReactNode } from 'react';
import type { LoggedInUser } from '~/app/schemas/user';

const AuthContext = createContext<null | LoggedInUser>(null);

export type AuthProviderProps = {
	children: ReactNode;
	user: LoggedInUser;
};

export const AuthProvider = ({ user, children }: AuthProviderProps) => {
	const navigate = useNavigate();

	useEffect(() => {
		const logoutListener = events.listen('logout', () => {
			removeSetting('user');
			navigate('/login');
		});

		return () => {
			logoutListener.remove();
		};
	}, [navigate]);

	return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const login = (user: LoggedInUser) => {
	events.emit('login', user);
};

export const logout = () => {
	events.emit('logout');
};

export const useUser = (): LoggedInUser => {
	const user = useContext(AuthContext);
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (user === undefined)
		throw new Error('useUser must be used within a UserProvider');

	if (!user) throw new Error('useUser must be used in authorized page');

	return user;
};
