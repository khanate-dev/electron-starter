import { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	getSetting,
	removeSetting,
	setSetting,
} from '~/shared/helpers/settings';
import { dayjsUtc } from '~/shared/helpers/date';

import type { LoggedInUser } from '~/app/schemas/user';

const UserContext = createContext<null | LoggedInUser>(null);

const defaultUser: LoggedInUser = {
	userID: 1 as DbId,
	userName: 'admin',
	userType: 'Administrator',
	token: '8224f044-0407-4021-aba9-aa537354ca43',
	imageUpdatedAt: null,
	createdAt: dayjsUtc.utc(),
	updatedAt: dayjsUtc.utc(),
};

export const UserProvider = ({ children }: ComponentWithChildren) => {
	const navigate = useNavigate();

	useEffect(() => {
		if (!getSetting('user')) setSetting('user', defaultUser);

		const logout = () => {
			if (!getSetting('user')) setSetting('user', defaultUser);
			removeSetting('user');
			navigate('/login');
		};
		window.addEventListener('logout', logout);

		return () => window.removeEventListener('logout', logout);
	}, [navigate]);

	return (
		<UserContext.Provider value={defaultUser}>{children}</UserContext.Provider>
	);
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
