import { CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import locale from 'dayjs/locale/en';
import { Toaster } from 'react-hot-toast';
import { RouterProvider, createHashRouter } from 'react-router-dom';

import { ErrorBoundary } from './components/app/error-boundary.component';
import { SerialPortProvider } from './contexts/serial-port.context';
import { dashboardRoutes } from './dashboard.routes';
import { useMode } from './hooks/mode.hook';
import { Dashboard } from './routes/dashboard/dashboard.route';
import { Welcome } from './routes/dashboard/welcome.route';
import { Example } from './routes/example.route';
import { Login } from './routes/login.route';
import { getMuiTheme } from './theme';

import type { RouterProviderProps } from 'react-router-dom';

const router = createHashRouter([
	{
		path: 'login',
		element: <Login />,
		errorElement: <ErrorBoundary />,
		loader: Login.loader,
	},
	{
		path: 'test',
		element: <Dashboard />,
		errorElement: <ErrorBoundary />,
		loader: Dashboard.loader,
		children: [
			{
				errorElement: <ErrorBoundary />,
				children: [{ index: true, element: <Welcome /> }, ...dashboardRoutes],
			},
		],
	},
	{
		path: '',
		element: <Example />,
		errorElement: <ErrorBoundary />,
	},
]);
export const Providers = (props: RouterProviderProps) => {
	const mode = useMode();
	return (
		<ThemeProvider theme={getMuiTheme(mode)}>
			<CssBaseline />
			<Toaster
				gutter={10}
				toastOptions={{
					style: {
						backgroundColor: mode === 'dark' ? '#333' : '#efefef',
						color: mode === 'dark' ? '#fff' : '#111',
						textTransform: 'capitalize',
					},
				}}
			/>
			<LocalizationProvider
				dateAdapter={AdapterDayjs}
				adapterLocale={locale.name}
			>
				<SerialPortProvider>
					<RouterProvider {...props} />
				</SerialPortProvider>
			</LocalizationProvider>
		</ThemeProvider>
	);
};

export const App = () => {
	return <Providers router={router} />;
};
