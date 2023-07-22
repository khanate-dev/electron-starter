import { createContext, useContext, useEffect, useState } from 'react';

import { events } from '~/app/helpers/events';
import { getSetting, setSetting } from '~/app/helpers/settings';

import type { PropsWithChildren } from 'react';

const DarkModeContext = createContext<boolean>(false);

const prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

const defaultIsDarkMode = getSetting('isDarkMode') ?? prefersDarkQuery.matches;

export const DarkModeProvider = ({ children }: PropsWithChildren) => {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(defaultIsDarkMode);

	useEffect(() => {
		const toggleListener = events.listen('toggleDarkMode', () => {
			setIsDarkMode((prev) => {
				setSetting('isDarkMode', !prev);
				return !prev;
			});
		});

		const updateListener = events.listen('updateDarkMode', ({ detail }) => {
			setSetting('isDarkMode', detail);
			setIsDarkMode(detail);
		});

		const handlePrefersChange = (event: MediaQueryListEvent) => {
			setSetting('isDarkMode', event.matches);
			setIsDarkMode(event.matches);
		};
		prefersDarkQuery.addEventListener('change', handlePrefersChange);

		return () => {
			toggleListener.remove();
			updateListener.remove();
			prefersDarkQuery.removeEventListener('change', handlePrefersChange);
		};
	}, []);

	return (
		<DarkModeContext.Provider value={isDarkMode}>
			{children}
		</DarkModeContext.Provider>
	);
};

export const useDarkMode = () => {
	const isDarkMode = useContext(DarkModeContext);
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (isDarkMode === undefined)
		throw new Error('useDarkMode must be used within an DarkModeProvider');

	return isDarkMode;
};

export const toggleDarkMode = () => {
	events.emit('toggleDarkMode');
};

export const updateDarkMode = (isDarkMode: boolean) => {
	events.emit('updateDarkMode', isDarkMode);
};
