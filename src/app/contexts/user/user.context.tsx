import { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { removeSetting } from '~/app/helpers/settings';

import type { PropsWithChildren } from 'react';
import type { LoggedInUser } from '~/app/schemas/user';

const UserContext = createContext<null | LoggedInUser>(null);

type UserProviderProps = PropsWithChildren<{ user: LoggedInUser }>;

export const UserProvider = ({ user, children }: UserProviderProps) => {
	const navigate = useNavigate();

	useEffect(() => {
		const logout = () => {
			removeSetting('user');
			navigate('/login');
		};
		window.addEventListener('logout', logout);
		return () => window.removeEventListener('logout', logout);
	}, [navigate]);

	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

/** fires the logout event to trigger a logout and redirect to login screen */
export const logout = () => {
	const event = new Event('logout', {
		bubbles: true,
	});
	window.dispatchEvent(event);
};

export const useUser = (): LoggedInUser => {
	const user = useContext(UserContext);
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (user === undefined)
		throw new Error('useUser must be used within a UserProvider');

	if (!user) throw new Error('useUser must be used in authorized page');

	return user;
};
