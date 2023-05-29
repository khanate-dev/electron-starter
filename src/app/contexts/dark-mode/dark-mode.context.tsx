import { createContext, useContext, useEffect, useState } from 'react';

import { getSetting, setSetting } from '~/app/helpers/settings';

import type { PropsWithChildren } from 'react';

const DarkModeContext = createContext<boolean>(false);

const prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

const defaultIsDarkMode = getSetting('isDarkMode') ?? prefersDarkQuery.matches;

export const DarkModeProvider = ({ children }: PropsWithChildren) => {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(defaultIsDarkMode);

	useEffect(() => {
		const toggleDarkMode: EventListener = () => {
			setIsDarkMode((prev) => {
				setSetting('isDarkMode', !prev);
				return !prev;
			});
		};

		const updateDarkMode: EventListener = (event) => {
			const newIsDarkMode = (event as CustomEvent).detail;
			if (typeof newIsDarkMode !== 'boolean')
				throw new Error('isDarkMode must be a boolean');

			setSetting('isDarkMode', newIsDarkMode);
			setIsDarkMode(newIsDarkMode);
		};

		const handlePrefersChange = (event: MediaQueryListEvent) => {
			setSetting('isDarkMode', event.matches);
			setIsDarkMode(event.matches);
		};

		window.addEventListener('toggle-dark-mode', toggleDarkMode);
		window.addEventListener('update-dark-mode', updateDarkMode);
		prefersDarkQuery.addEventListener('change', handlePrefersChange);

		return () => {
			window.removeEventListener('toggle-dark-mode', toggleDarkMode);
			window.removeEventListener('update-dark-mode', updateDarkMode);
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
	const toggleEvent = new Event('toggle-dark-mode', {
		bubbles: true,
	});
	window.dispatchEvent(toggleEvent);
};

export const updateDarkMode = (isDarkMode: boolean) => {
	const updateEvent = new CustomEvent('update-dark-mode', {
		detail: isDarkMode,
		bubbles: true,
	});
	window.dispatchEvent(updateEvent);
};
