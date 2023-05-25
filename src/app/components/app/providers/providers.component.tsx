import { RouterProvider } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Toaster } from 'react-hot-toast';
import locale from 'dayjs/locale/en';

import { getMuiTheme } from '~/app/theme';
import { DarkModeProvider, useDarkMode } from '~/app/contexts/dark-mode';

import type { RouterProviderProps } from 'react-router-dom';

export type ProvidersProps = RouterProviderProps;

const ThirdPartyProviders = (props: ProvidersProps) => {
	const isDarkMode = useDarkMode();

	return (
		<ThemeProvider theme={getMuiTheme(isDarkMode ? 'dark' : 'light')}>
			<CssBaseline />
			<Toaster
				gutter={10}
				toastOptions={{
					style: {
						backgroundColor: isDarkMode ? '#333' : '#efefef',
						color: isDarkMode ? '#fff' : '#111',
						textTransform: 'capitalize',
					},
				}}
			/>
			<LocalizationProvider
				dateAdapter={AdapterDayjs}
				adapterLocale={locale.name}
			>
				<RouterProvider {...props} />
			</LocalizationProvider>
		</ThemeProvider>
	);
};

export const Providers = (props: ProvidersProps) => (
	<DarkModeProvider>
		<ThirdPartyProviders {...props} />
	</DarkModeProvider>
);
