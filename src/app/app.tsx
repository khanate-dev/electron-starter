import { createHashRouter } from 'react-router-dom';

import { ErrorBoundary } from '~/app/components/app/error-boundary';
import { Providers } from '~/app/components/app/providers';
import { Dashboard, dashboardRoutes } from '~/app/routes/dashboard';
import { Welcome } from '~/app/routes/dashboard/welcome';
import { Login } from '~/app/routes/login';

import { Example } from './routes/example';

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
				children: [
					{
						index: true,
						element: <Welcome />,
					},
					...dashboardRoutes,
				],
			},
		],
	},
	{
		path: '',
		element: <Example />,
		errorElement: <ErrorBoundary />,
	},
]);

export const App = () => {
	return <Providers router={router} />;
};
